import {
  Record,
  getRecordV2Key,
  deleteRecordV2,
  createRecordV2Instruction,
  updateRecordV2Instruction,
  validateRecordV2Content,
  GUARDIANS,
  writRoaRecordV2,
} from "@bonfida/spl-name-service";
import {
  PublicKey,
  Transaction,
  Connection,
  TransactionInstruction,
} from "@solana/web3.js";
import { formatRecordValue } from "@/utils/formatRecordValue";
import { makeTx } from "@/utils/makeTx";
import { Toast } from "@bonfida/components";
import { checkAccountExists } from "@bonfida/hooks";
import { sleep } from "../sleep";
import { simpleValidation } from "../simple-record-validation";
import { useRecordsV2Guardians } from "@/hooks/useRecordsV2Guardian";

export const updateRecord = async (
  connection: Connection,
  recordName: Record,
  domain: string,
  recordVal: string,
  publicKey: PublicKey | null,
  signTransaction: (transaction: Transaction) => Promise<Transaction>,
  signMessage: (message: Uint8Array) => Promise<Uint8Array>,
  toast: Toast,
  isRoaSupported?: boolean,
  sendRoaRequest?: (domain: string, record: Record) => Promise<void>
) => {
  if (!publicKey || !signTransaction || !signMessage) return;
  try {
    const ixs: TransactionInstruction[] = [];
    const recordKey = getRecordV2Key(domain, recordName);
    const exist = await checkAccountExists(connection, recordKey);
    const formattedValue = formatRecordValue(recordVal, recordName);

    if (formattedValue === "") {
      if (!exist) return;
      // Delete the record
      ixs.push(deleteRecordV2(domain, recordName, publicKey, publicKey));
      const { signature, success } = await makeTx(
        connection,
        publicKey,
        ixs,
        signTransaction,
        toast
      );
      console.log(signature, success);
      return;
    }

    const { err } = simpleValidation(formattedValue, recordName);
    if (err) {
      return toast.error(err);
    }

    if (!exist) {
      const ix = createRecordV2Instruction(
        domain,
        recordName,
        formattedValue,
        publicKey,
        publicKey
      );
      ixs.push(ix);
    }

    ixs.push(
      ...[
        updateRecordV2Instruction(
          domain,
          recordName,
          formattedValue,
          publicKey,
          publicKey
        ),
        validateRecordV2Content(
          true,
          domain,
          recordName,
          publicKey,
          publicKey,
          publicKey
        ),
      ]
    );

    /**
     * If eligible to RoA create write ix
     */

    if (isRoaSupported && GUARDIANS.get(recordName)) {
      ixs.push(
        writRoaRecordV2(
          domain,
          recordName,
          publicKey,
          publicKey,
          GUARDIANS.get(recordName)!
        )
      );
    } else if (recordName === Record.SOL) {
      ixs.push(
        writRoaRecordV2(
          domain,
          recordName,
          publicKey,
          publicKey,
          new PublicKey(formattedValue)
        )
      );
    }

    const { signature, success } = await makeTx(
      connection,
      publicKey,
      ixs,
      signTransaction,
      toast
    );
    console.log(signature, success);
    await sleep(1_000);

    /**
     * If eligible to RoA send server request
     */
    if (isRoaSupported) {
      await sendRoaRequest!(domain, recordName);
    }
  } catch (err) {
    console.error(err);
  }
};
