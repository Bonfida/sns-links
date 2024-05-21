import { Record } from "@bonfida/spl-name-service";
import { useToastContext } from "@bonfida/components";
import { sleep } from "../utils/sleep";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { updateROAHandler } from "@/utils/update-roa";

export const useUpdateROA = () => {
  const { connection } = useConnection();
  const { publicKey, signAllTransactions } = useWallet();
  const { toast } = useToastContext();

  const updateROA = async ({
    domain,
    record,
  }: {
    domain: string;
    record: Record;
  }) => {
    if (!publicKey || !signAllTransactions) return;
    try {
      toast.processing();

      await updateROAHandler({
        connection,
        publicKey,
        domain,
        signAllTransactions,
        record,
      });

      toast.success("all");
    } catch (err) {
      console.log("error", err);
      toast.error();
    } finally {
      await sleep(1_000);
      toast.close();
    }
  };
  return updateROA;
};
