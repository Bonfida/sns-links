import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Record,
  getDomainKeySync,
  NameRegistryState,
  getRecordV2Key,
  GUARDIANS,
} from "@bonfida/spl-name-service";
import { PublicKey } from "@solana/web3.js";
import { Record as SnsRecord, Validation } from "@bonfida/sns-records";
import { QueryKey, UseQueryOptions, useQuery } from "@tanstack/react-query";
import { SUPPORTED_GUARDIANS } from "./useRecordsV2Guardian";
import { ORDERED_RECORDS } from "@/app/constants/ordered-records";

export type OptionalQueryOptions<
  T = unknown,
  U extends keyof UseQueryOptions<T, unknown, T, QueryKey> = never
> = Omit<UseQueryOptions<T, unknown, T, QueryKey>, U | "queryKey" | "queryFn">;

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
  options: OptionalQueryOptions<Result[]> = {}
) => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

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
  return useQuery({
    queryKey: ["useRecordsV2", domain],
    queryFn: fn,
    staleTime: 30_000,
    ...options,
  });
};
