import { Button } from "@bonfida/components";
import Image from "next/image";
import Link from "next/link";

import { Step } from "./VerifyEVMRecord";
import { Divider } from "../../Divider";

export const HowDoesItWork = ({
  setStep,
  close,
}: {
  setStep: (x: Step) => void;
  close: () => void;
}) => {
  return (
    <div className="font-azeret max-w-[800px]">
      <p className="font-azeret text-[16px] text-primary-text/80">
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
          <p className="font-azeret text-primary-text/80 text-[16px] mt-3">
            1. Go to the Etherscan Signature page{" "}
            <Link
              target="_blank"
              className="underline text-link"
              href={"https://etherscan.io/verifiedSignatures"}
            >
              {"https://etherscan.io/verifiedSignatures"}
            </Link>
          </p>
          <p className="font-azeret text-primary-text/80 text-[16px] mt-3">
            2. Click on <span className="text-link">Sign Message</span>
          </p>
          <p className="font-azeret text-primary-text/80 text-[16px] mt-3">
            3. Connect your wallet
          </p>
        </div>
      </div>
      <div className="flex w-full mt-10 space-x-4">
        <Button
          onClick={close}
          className="w-1/2 h-[64px] rounded-[24px] border-primary-border border-[1px] text-primary-text font-azeret normal-case"
          buttonType="secondary"
        >
          Close
        </Button>
        <Button
          onClick={() => setStep(Step.CopyMessage)}
          className="w-1/2 h-[64px] rounded-[24px] border-primary-border border-[1px] text-primary-text font-azeret normal-case"
          buttonType="primary"
        >
          Next
        </Button>
      </div>
    </div>
  );
};
