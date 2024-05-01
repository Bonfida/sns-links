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
import { makeTxV2 } from "@/utils/makeTx";
import { Toast, useToastContext } from "@bonfida/components";
import { checkAccountExists } from "@bonfida/hooks";
import { sleep } from "../utils/sleep";
import { simpleValidation } from "../utils/simple-record-validation";
import { useRecordsV2Guardians } from "@/hooks/useRecordsV2Guardian";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { updateRecordHanlder } from "@/utils/update-record/update-record";
import { useFetchRecords } from "./useFetchRecords";

export const useUpdateRecord = () => {
  const { connection } = useConnection();
  const { publicKey, signAllTransactions } = useWallet();
  const { toast } = useToastContext();

  const updateRecord = async ({
    domain,
    recordName,
    recordValue,
    currentValue,
    isRoaSupported,
    sendRoaRequest,
  }: {
    domain: string;
    recordName: Record;
    recordValue: string;
    currentValue: string | undefined;
    isRoaSupported?: boolean;
    sendRoaRequest?:
      | ((domain: string, record: Record) => Promise<void>)
      | undefined;
  }) => {
    if (recordValue === currentValue || recordValue.length === 0) {
      toast.error("Nothing to update");
      return;
    }
    try {
      toast.processing();

      await updateRecordHanlder({
        connection,
        publicKey,
        domain,
        signAllTransactions: signAllTransactions!,
        isRoaSupported,
        sendRoaRequest,
        recordName,
        recordValue,
      });

      toast.success("all");
      //add a refresh here
    } catch (err) {
      console.log("error", err);
      toast.error();
    } finally {
      await sleep(1_000);
      toast.close();
    }
  };
  return updateRecord;
};
