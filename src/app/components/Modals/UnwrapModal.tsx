"use client";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { unwrap } from "@/utils/tokenizer/unwrap";
import { useToastContext } from "@bonfida/components";
import { makeTxV2 } from "@/utils/makeTx";
import { sleep } from "@/utils/sleep";
import { twMerge } from "tailwind-merge";
import { useTheme } from "next-themes";

const UnwrapModal = ({
  domain,
  close,
  refresh,
}: {
  domain: string;
  close: () => void;
  refresh: () => Promise<void>;
}) => {
  const { connection } = useConnection();
  const { publicKey, signAllTransactions } = useWallet();
  const { toast } = useToastContext();
  const { theme } = useTheme();

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
      refresh();
      await sleep(1_000);
      toast.close();
      close();
    }
  };

  return (
    <div className="flex flex-col justify-start items-start bg-primary-bg p-6 rounded-2xl border border-primary-border">
      <span className="text-2xl text-primary-text font-azeret font-semibold">
        Tokenized Domain
      </span>
      <div className="space-y-4">
        <p className="text-primary-text font-medium text-base">
          Before you can add/edit a link to your domain, you need to unwrap it
          first.
        </p>
        <p className="text-primary-text font-medium text-base">
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
              className={twMerge(
                "sm:w-[268px] w-[329px] h-[47px] rounded-[24px] border-t text-white bg-primary-bg border-t-top-border-highlight active:border-t-0 font-bold",
                theme === "dark"
                  ? "bg-gradient-to-b from-glass-bg to-bg-primary-bg"
                  : "bg-edit-button-bg"
              )}
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
