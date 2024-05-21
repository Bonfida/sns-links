import { useRequest } from "ahooks";
import type { Options } from "ahooks/es/useRequest/src/types";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Record,
  getDomainKeySync,
  NameRegistryState,
  getRecordV2Key,
  serializeRecordV2Content,
  GUARDIANS,
} from "@bonfida/spl-name-service";
import { PublicKey } from "@solana/web3.js";
import {
  Record as SnsRecord,
  Validation,
  RecordHeader,
} from "@bonfida/sns-records";
import { useQueryClient } from "@tanstack/react-query";
import { ORDERED_RECORDS } from "@/app/constants/ordered-records";
import { SUPPORTED_GUARDIANS } from "./useRecordsV2Guardian";

export interface Result {
  record: Record;
  data: SnsRecord | undefined;
  isOwner: boolean;
  browsable: boolean;
  isSigned: boolean;
  isVerified: boolean;
  isSignInvalid: boolean;
  canBeVerifiedBy?: PublicKey;
}

const BROWSABLE = [
  Record.Url,
  Record.IPFS,
  Record.ARWV,
  Record.SHDW,
  Record.CNAME,
];

export const EVM_RECORDS = [Record.ETH, Record.BSC, Record.Injective];

export const useRecordsV2 = (
  domain: string,
  options: Omit<Options<Result[], []>, "refreshDeps" | "cacheKey"> = {}
) => {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();

  const fn = async () => {
    const result: Result[] = [];
    const { registry } = await NameRegistryState.retrieve(
      connection,
      getDomainKeySync(domain).pubkey
    );
    const owner = registry.owner;

    const keys = ORDERED_RECORDS.map((e) =>
      getRecordV2Key(domain, e as Record)
    );
    const records = await SnsRecord.retrieveBatch(connection, keys);

    records.forEach((r, idx) => {
      const record = ORDERED_RECORDS[idx] as Record;

      let isSigned = false;
      let isVerified = false;
      let isSignInvalid = false;
      let canBeVerifiedBy: PublicKey | undefined = undefined;

      // Validation of the signature in case of domain transfer
      if (r) {
        isSigned =
          r.getStalenessId().compare(owner.toBuffer()) === 0 &&
          r.header.stalenessValidation === Validation.Solana;

        if (SUPPORTED_GUARDIANS.includes(record)) {
          const guardian = GUARDIANS.get(record);
          if (guardian) {
            isVerified =
              r.getRoAId().compare(guardian.toBuffer()) === 0 &&
              r.header.rightOfAssociationValidation === Validation.Solana;
          }
        }

        if (Record.SOL === record) {
          isVerified =
            r.getRoAId().compare(r.getContent()) === 0 &&
            r.header.rightOfAssociationValidation === Validation.Solana;
        }

        if (EVM_RECORDS.includes(record)) {
          isVerified =
            r.getRoAId().compare(r.getContent()) === 0 &&
            r.header.rightOfAssociationValidation === Validation.Ethereum;
        }

        if (
          EVM_RECORDS.includes(record) &&
          r.header.rightOfAssociationValidation === Validation.None &&
          publicKey?.equals(owner) &&
          !isVerified
        ) {
          canBeVerifiedBy = publicKey;
        }

        if (
          r.header.rightOfAssociationValidation === Validation.UnverifiedSolana
        ) {
          canBeVerifiedBy = new PublicKey(r.getRoAId());
        }

        if (!isSigned) {
          isVerified = false;
        }
      }

      result.push({
        record,
        data: r,
        isOwner: !!publicKey?.equals(owner),
        browsable: BROWSABLE.includes(record),
        isSigned,
        isVerified,
        isSignInvalid,
        canBeVerifiedBy,
      });
    });

    return result;
  };

  return useRequest(fn, {
    refreshDeps: [domain, connected],
    cacheKey: `useRecordsV2-${domain}`,
    cacheTime: 30_000,
    ...options,
  });
};

/**
 * You can use this hook to easily mutate the "useRecords" cache by omitting
 * a lot of preparatory steps.
 * Under the hood it will also mutate other hooks that rely on the value of records.
 */
export const useMutateRecordsV2 = ({
  domain,
  publicKey,
}: {
  domain: string;
  publicKey?: PublicKey | null;
}) => {
  const queryClient = useQueryClient();
  const recordsHook = useRecordsV2(domain, { manual: true });

  /**
   * Raw mutation. Directly applies patches to the cache.
   * Might be used to add/update/delete operations
   */
  const mutate = ({
    patches,
  }: {
    patches: Parameters<typeof mutateRecords>["0"]["patches"];
  }) => {
    mutateRecords({
      mutate: recordsHook.mutate,
      currentList: recordsHook.data,
      patches,
    });

    if (publicKey) {
      const pic = patches.find((item) => item.record === Record.Pic);
      if (pic) {
        queryClient.setQueryData(["useProfilePic", domain], pic.data);
      }
    }
  };

  /**
   * Mutation that simply deletes all the data for the provided list of records
   */
  const mutateDeletion = (records: Record[]) => {
    // Calls exactly "mutate", but not raw utility "mutateRecords",
    // because "mutate" also handles other mutations based on provided records
    mutate({
      patches: records.map((r) => ({
        record: r,
        isSigned: false,
        data: undefined,
      })),
    });
  };

  return { mutate, mutateDeletion };
};

export const mutateRecords = ({
  mutate,
  currentList,
  patches,
}: {
  mutate: ReturnType<typeof useRecordsV2>["mutate"];
  currentList: ReturnType<typeof useRecordsV2>["data"];
  patches: ({
    record: Record;
    data: string | undefined;
    userKey?: PublicKey;
  } & Partial<Omit<Result, "data" | "record">>)[];
}) => {
  mutate(
    currentList?.map((item) => {
      const patchRecord = patches.find((patch) => patch.record === item.record);

      if (patchRecord) {
        const { record, data, userKey, ...rest } = patchRecord;
        let patchedData: SnsRecord | undefined = undefined;

        if (data && userKey) {
          const serializedContent = serializeRecordV2Content(data, record);
          const recordData = Buffer.concat([
            userKey.toBuffer(),
            serializedContent,
          ]);

          patchedData = new SnsRecord(
            new RecordHeader({
              contentLength: serializedContent.length,
              stalenessValidation: 1,
              rightOfAssociationValidation: 0,
            }),
            recordData
          );
        }

        return {
          ...item,
          ...rest,
          data: patchedData,
          isSigned: !!patchedData,
        } as Result;
      }
      return item;
    })
  );
};
