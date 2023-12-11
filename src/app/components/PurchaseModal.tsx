"use client";
import { useState } from "react";
import Widget from "@bonfida/sns-widget";
import "@bonfida/sns-widget/style.css";
import { useConnection } from "@solana/wallet-adapter-react";
const endpoint = process.env.NEXT_PUBLIC_ENDPOINT;

const PurchaseModal = () => {
  const { connection } = useConnection();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const handlePurchaseClick = () => {
    setIsPurchasing(true);
  };
  return (
    <>
      <div className="bg-bds-dark-blues-DB900 items-center justify-center rounded-[24px] border-[1px] border-bds-dark-blues-DB600 max-w-[400px] flex flex-col px-10 py-10 space-y-5">
        <h2 className="text-center text-white font-azeret">
          Click below to get started!
        </h2>
        <Widget
          connection={connection}
          isDark={true}
          rootWrapperClassNames=""
        />
        {/* <button
          className="px-3 py-2 text-white bg-blue-600 rounded-lg font-azeret"
          onClick={handlePurchaseClick}
        >
          Purchase domain
        </button> */}
      </div>
    </>
  );
};

export default PurchaseModal;
