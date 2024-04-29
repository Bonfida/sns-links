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
  VersionedTransaction,
} from "@solana/web3.js";
import { formatRecordValue } from "@/utils/formatRecordValue";
import { makeTxV2 } from "@/utils/makeTx";
import { checkAccountExists } from "@bonfida/hooks";
import { simpleValidation } from "../simple-record-validation";

type TransactionType = Transaction | VersionedTransaction;

export const updateRecordHanlder = async ({
  connection,
  publicKey,
  domain,
  recordName,
  recordVal,
  signAllTransactions,
  isRoaSupported,
  sendRoaRequest,
}: {
  connection: Connection;
  publicKey: PublicKey | null;
  domain: string;
  recordName: Record;
  recordVal: string;
  signAllTransactions: (txs: TransactionType[]) => Promise<TransactionType[]>;
  isRoaSupported?: boolean;
  sendRoaRequest?: (domain: string, record: Record) => Promise<void>;
}) => {
  if (!publicKey || !signAllTransactions) {
    throw new Error();
  }

  try {
    const instructions: TransactionInstruction[] = [];
    const recordKey = getRecordV2Key(domain, recordName);
    const exist = await checkAccountExists(connection, recordKey);
    const formattedValue = formatRecordValue(recordVal, recordName);

    if (formattedValue === "") {
      if (!exist) return;
      // Delete the record
      instructions.push(
        deleteRecordV2(domain, recordName, publicKey, publicKey)
      );
      await makeTxV2({
        connection,
        feePayer: publicKey,
        instructions,
        signAllTransactions,
      });
    } else {
      const { err } = simpleValidation(formattedValue, recordName);
      if (err) {
        throw new Error();
      }
    }

    if (!exist) {
      const ix = createRecordV2Instruction(
        domain,
        recordName,
        formattedValue,
        publicKey,
        publicKey
      );
      instructions.push(ix);
    }

    instructions.push(
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
      instructions.push(
        writRoaRecordV2(
          domain,
          recordName,
          publicKey,
          publicKey,
          GUARDIANS.get(recordName)!
        )
      );
    } else if (recordName === Record.SOL) {
      instructions.push(
        writRoaRecordV2(
          domain,
          recordName,
          publicKey,
          publicKey,
          new PublicKey(formattedValue)
        )
      );
    }

    await makeTxV2({
      connection,
      feePayer: publicKey,
      instructions,
      signAllTransactions,
    });

    /**
     * If eligible to RoA send server request
     */
    if (isRoaSupported) {
      await sendRoaRequest!(domain, recordName);
    }
  } catch (err) {
    throw new Error();
    console.error(err);
  }
};
