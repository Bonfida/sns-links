import { Record } from "@bonfida/spl-name-service";
import { useToastContext } from "@bonfida/components";
import { sleep } from "../utils/sleep";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { updateRecordHanlder } from "@/utils/update-record/update-record";

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
    } catch (err) {
      toast.error();
      console.log("error", err);
    } finally {
      await sleep(2_000);
      toast.close();
    }
  };
  return updateRecord;
};
