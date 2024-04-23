"use client";
import { useState } from "react";
import "@bonfida/sns-widget/style.css";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
const endpoint = process.env.NEXT_PUBLIC_ENDPOINT;
import { unwrap } from "@/utils/tokenizer/unwrap";
import { useToastContext } from "@bonfida/components";
import { makeTx } from "@/utils/makeTx";

const UnwrapModal = ({
  domain,
  close,
}: {
  domain: string;
  close: () => void;
}) => {
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const { toast } = useToastContext();

  const handleUnwrap = async () => {
    try {
      const ix = await unwrap(connection, domain, publicKey!);

      const { success, signature } = await makeTx(
        connection,
        publicKey!,
        ix,
        signTransaction!,
        toast
      );

      if (success) {
        toast.success("Unwrapped successfully!");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="flex flex-col justify-start items-start">
      <span className="text-2xl text-modal-text font-azeret font-semibold">
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
              className="sm:w-[268px] w-[329px]  h-[47px] rounded-[24px]  border-t text-action-button-text border-t-modal-border active:border-t-0 font-bold"
              onClick={() => {
                handleUnwrap();
              }}
            >
              Unwrap
            </button>
            <button
              className="sm:w-[268px] w-[329px] h-[47px] rounded-[24px] border-t text-modal-text bg-modal-bg  border-t-modal-border active:border-t-0 font-bold"
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
