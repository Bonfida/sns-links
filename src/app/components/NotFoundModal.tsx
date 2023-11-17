import { useState } from "react";
import Widget from "@bonfida/sns-widget";
import "@bonfida/sns-widget/style.css";
const endpoint = process.env.NEXT_PUBLIC_ENDPOINT;

const NotFoundModal = () => {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const handlePurchaseClick = () => {
    setIsPurchasing(true);
  };
  return (
    <>
      <div className="bg-bds-dark-blues-DB900 items-center justify-center rounded-[24px] border-[1px] border-bds-dark-blues-DB600 max-w-[400px] flex flex-col px-10 py-10 space-y-5">
        <h1 className="text-white font-azeret text-center">
          Oops! Looks like the wallet you have connected does not contain any
          .sol domains. Please try connecting with another wallet address.
        </h1>
        {/* <a href="https://www.sns.id/" target="_blank"> */}
        <button
          className="px-3 py-2 text-white bg-blue-600 rounded-lg font-azeret"
          onClick={handlePurchaseClick}
        >
          Purchase domain
        </button>
      </div>
      {/* {isPurchasing && <Widget endpoint={endpoint!} />} */}
    </>
  );
};

export default NotFoundModal;
