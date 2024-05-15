import { Record, getRecordV2Key } from "@bonfida/spl-name-service";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@bonfida/components";
import { useEffect, useState } from "react";
import { stripPrefix } from "./EnterSignature";
import { Step } from "./VerifyEVMRecord";
import { Divider } from "../../Divider";
import Image from "next/image";
import { useTheme } from "next-themes";
import { twMerge } from "tailwind-merge";

const RECORD_SUFFIX = "\nFor record: ";
const STALENESS_SUFFIX = "\nStaleness ID: ";

const generateMessage = (content: string, recordKey: string, owner: string) => {
  return content + RECORD_SUFFIX + recordKey + STALENESS_SUFFIX + owner;
};

export const CopyMessage = ({
  record,
  domain,
  recordContent,
  setStep,
}: {
  recordContent: string;
  record: Record;
  domain: string;
  setStep: (x: Step) => void;
}) => {
  const { publicKey } = useWallet();
  const [success, setSuccess] = useState(false);

  const { theme } = useTheme();

  const message = generateMessage(
    stripPrefix(recordContent),
    getRecordV2Key(domain, record).toBase58(),
    publicKey?.toBase58() || ""
  );

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined = undefined;
    if (success) {
      timeout = setTimeout(() => {
        setSuccess(false);
      }, 2000);
    }

    return () => clearTimeout(timeout);
  }, [success]);

  const handle = () => {
    navigator.clipboard.writeText(message);
    setSuccess(true);
  };

  return (
    <div className="font-azeret w-screen max-w-[800px]">
      <p className="font-azeret text-[16px] text-primary-text">Sign Message</p>
      <p className="text-primary-text font-azeret text-[24px] font-medium">
        Step 2 of 3 - Sign Message
      </p>
      <Divider className="w-full h-[1px] my-5" />
      <div className="flex flex-col items-start space-x-4 md:flex-row">
        <div className="max-w-[350px] h-[150px] p-4 border-[1px] border-primary-border rounded-md bg-input-bg text-primary-text">
          <pre
            style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
            className="text-xs font-semibold"
          >
            {message}
          </pre>
        </div>
        <div>
          <p className="font-azeret font-medium text-primary-text text-[20px]">
            Copy the message
          </p>
          <p className="font-azeret text-primary-text text-[16px] mt-3">
            Copy the message in Etherscan and sign it
          </p>
          <button
            className="btn w-[150px] mt-5 bg-[#13122B]/90 text-white"
            type="button"
            onClick={handle}
          >
            {success ? (
              <div className="flex items-center space-x-2">
                <p>Copied</p>
                <div>
                  <Image
                    src={
                      theme === "dark"
                        ? "/confirm/green-check.svg"
                        : "/confirm/purple-check.svg"
                    }
                    alt="confirmed"
                    height={20}
                    width={20}
                  />
                </div>
              </div>
            ) : (
              "Copy"
            )}
          </button>
        </div>
      </div>
      <div className="flex w-full mt-10 space-x-4">
        <button
          onClick={() => setStep(Step.HowDoesItWork)}
          className={twMerge(
            "w-1/2 h-[47px] rounded-[15px] border-t border-t-top-border-highlight text-white font-azeret normal-case font-bold text-base",
            theme === "dark"
              ? "bg-gradient-to-b from-glass-bg to-bg-primary-bg"
              : "bg-edit-button-bg"
          )}
        >
          Back
        </button>
        <button
          onClick={() => setStep(Step.EnterSignature)}
          style={{ backgroundImage: "var(--action-button-bg)" }}
          className="w-1/2 h-[47px] rounded-[15px] border-t border-t-top-border-highlight text-action-button-text font-azeret normal-case font-bold text-base"
        >
          Next
        </button>
      </div>
    </div>
  );
};
