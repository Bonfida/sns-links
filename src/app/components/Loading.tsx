import { useState } from "react";
import { SpinnerFida } from "@bonfida/components";
import "@bonfida/sns-widget/style.css";
const endpoint = process.env.NEXT_PUBLIC_ENDPOINT;
const Loading = () => {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const handlePurchaseClick = () => {
    setIsPurchasing(true);
  };
  return (
    <>
      <div className="bg-bds-dark-blues-DB900 items-center justify-center rounded-[24px] border-[1px] border-bds-dark-blues-DB600 max-w-[400px] flex flex-col px-10 py-10 space-y-5">
        <SpinnerFida variant="white" className="animate-spin-speed" />
      </div>
    </>
  );
};

export default Loading;
