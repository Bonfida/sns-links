"use client";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { unwrap } from "@/utils/tokenizer/unwrap";
import { useToastContext } from "@bonfida/components";
import { makeTxV2 } from "@/utils/makeTx";
import { sleep } from "@/utils/sleep";

const UnwrapModal = ({
  domain,
  close,
}: {
  domain: string;
  close: () => void;
}) => {
  const { connection } = useConnection();
  const { publicKey, signAllTransactions } = useWallet();
  const { toast } = useToastContext();

  const handleUnwrap = async () => {
    if (!publicKey || !signAllTransactions) return;
    try {
      toast.processing();
      const instructions = await unwrap(connection, domain, publicKey!);

      const results = await makeTxV2({
        connection,
        feePayer: publicKey,
        instructions,
        signAllTransactions,
      });

      if (results.length > 0) {
        toast.success("Unwrapped successfully!");
      }
    } catch (error) {
      console.log("error", error);
      toast.error();
    } finally {
      await sleep(1_000);
      toast.close();
      close();
    }
  };

  return (
    <div className="flex flex-col justify-start items-start">
      <span className="text-2xl text-primary-text font-azeret font-semibold">
        Tokenized Domain
      </span>
      <div className="space-y-4">
        <p>
          Before you can add/edit a link to your domain, you need to unwrap it
          first.
        </p>
        <p>
          It&apos;s currently wrapped, allowing it to be sold on NFT
          marketplaces.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center w-full space-y-4">
        <div className="flex flex-col items-center justify-center w-full space-y-4">
          <div className="flex flex-col gap-y-3 sm:flex-row items-center justify-between w-full mt-6 space-x-1.5">
            <button
              style={{ backgroundImage: "var(--action-button-bg)" }}
              className="sm:w-[268px] w-[329px]  h-[47px] rounded-[24px]  border-t text-action-button-text border-t-primary-border active:border-t-0 font-bold"
              onClick={() => {
                handleUnwrap();
              }}
            >
              Unwrap
            </button>
            <button
              className="sm:w-[268px] w-[329px] h-[47px] rounded-[24px] border-t text-primary-text bg-primary-bg border-t-primary-border active:border-t-0 font-bold"
              onClick={() => {
                close();
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnwrapModal;
