import { Button } from "@bonfida/components";
import Image from "next/image";
import Link from "next/link";

import { Step } from "./VerifyEVMRecord";
import { Divider } from "../../Divider";
import { twMerge } from "tailwind-merge";
import { useTheme } from "next-themes";

export const HowDoesItWork = ({
  setStep,
  close,
}: {
  setStep: (x: Step) => void;
  close: () => void;
}) => {
  const { theme } = useTheme();
  return (
    <div className="font-azeret max-w-[800px] bg-primary-bg">
      <p className="font-azeret text-[16px] text-primary-text">
        Go to Etherscan
      </p>
      <p className="text-primary-text font-azeret text-[24px] font-medium">
        Step 1 of 3 - Go to Etherscan
      </p>
      <Divider className="w-full h-[1px] my-5" />
      <div className="flex flex-col items-center space-x-4 md:flex-row">
        <div className="max-w-[400px] max-h-[200px] overflow-clip">
          <Image
            src="/etherscan/etherscan.webp"
            alt=""
            width={500}
            height={500}
          />
        </div>
        <div>
          <p className="font-azeret font-medium text-primary-text text-[20px]">
            Go to Etherscan
          </p>
          <p className="font-azeret text-primary-text text-[16px] mt-3">
            1. Go to the Etherscan Signature page{" "}
            <Link
              target="_blank"
              className="underline text-link"
              href={"https://etherscan.io/verifiedSignatures"}
            >
              {"https://etherscan.io/verifiedSignatures"}
            </Link>
          </p>
          <p className="font-azeret text-primary-text text-[16px] mt-3">
            2. Click on <span className="text-link">Sign Message</span>
          </p>
          <p className="font-azeret text-primary-text text-[16px] mt-3">
            3. Connect your wallet
          </p>
        </div>
      </div>
      <div className="flex w-full mt-10 space-x-4">
        <button
          onClick={() => setStep(Step.CopyMessage)}
          style={{ backgroundImage: "var(--action-button-bg)" }}
          className="w-1/2 h-[47px] rounded-[15px] border-t border-t-top-border-highlight text-action-button-text font-azeret normal-case font-bold text-base"
        >
          Next
        </button>
        <button
          onClick={close}
          className={twMerge(
            "w-1/2 h-[47px] rounded-[15px] border-t border-t-top-border-highlight text-white font-azeret normal-case font-bold text-base",
            theme === "dark"
              ? "bg-gradient-to-b from-glass-bg to-bg-primary-bg"
              : "bg-edit-button-bg"
          )}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
