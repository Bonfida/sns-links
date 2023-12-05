"use client";
import { useContext, useState } from "react";
import "@bonfida/sns-widget/style.css";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
const endpoint = process.env.NEXT_PUBLIC_ENDPOINT;
import { unwrap } from "@/utils/tokenizer/unwrap";
import { useToastContext } from "@bonfida/components";
import { makeTx } from "@/utils/makeTx";
import { signAndSendInstructions } from "@bonfida/utils";

const UnwrapModal = ({ domain }: { domain: string }) => {
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const { toast } = useToastContext();
  const [isModalVisible, setIsModalVisible] = useState(true);
  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleUnwrapClick = async () => {
    try {
      const ix = await unwrap(connection, domain, publicKey!);

      const { success, signature } = await makeTx(
        connection,
        publicKey!,
        ix,
        signTransaction!,
        toast
      );

      closeModal();
      toast.success("Unwrapped successfully!");
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      {isModalVisible && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-10 "
          onClick={closeModal}
        >
          <div
            className="bg-[#03001A] sm:min-w-[880px] h-fit flex flex-col justify-center items-center border border-[#2A2A51] rounded-lg p-5 mt-10 md:mt-0"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl text-white font-azeret">
              Your domain is tokenized! Unwrap and try again to add a link!
            </h2>
            <div className="bg-gradient-to-r from-transparent to-transparent via-[#7C7CFF] w-full h-[1px] my-5" />
            <span>
              Tokenized domains can be sold on your favorite NFT marketplace.
              Easily rewrap your domain on sns.id.
            </span>
            <div className="flex flex-col items-center justify-center w-full space-y-4">
              <div className="flex items-center justify-between w-full mt-10 space-x-4">
                <button
                  className="w-1/2 h-[64px] rounded-[24px] border-opacity-20 border-white border-[1px] text-white font-azeret bg-[#7C7CFF]"
                  onClick={handleUnwrapClick}
                >
                  Unwrap
                </button>
                <button
                  className="w-1/2 h-[64px] rounded-[24px] border-opacity-20 border-white border-[1px] text-white font-azeret"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UnwrapModal;
