import { Button, SpinnerFida, State } from "@bonfida/components";
import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { ethValidateRecordV2Content, Record } from "@bonfida/spl-name-service";
import { makeTxV2 } from "@/utils/make-tx-v2/makeTx";
import { useToastContext } from "@/hooks/useToastContext";
import { ChainId } from "@bonfida/sns-emitter";
import { TransactionInstruction } from "@solana/web3.js";
import { Step } from "./VerifyEVMRecord";
import { Divider } from "../../Divider";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { useTheme } from "next-themes";
import { sleep } from "@/utils";

export const BridgeSuccess = ({
  domain,
  record,
  setState,
}: {
  domain: string;
  record: Record;
  setState: (x: State) => void;
}) => {
  return (
    <>
      <Image src="/assets/toast/confirmed.svg" alt="" width={64} height={64} />
      <p className="text-2xl text-center font-azeret font-medium text-primary-text mt-[48px]">
        Domain bridged!
      </p>
      <p className="text-sm font-azeret text-center font-medium text-bds-dark-blues-DB100 mt-[8px]">
        Great news! {domain}.sol has successfully been bridged to {record}
      </p>
      <Button
        onClick={() => setState(State.Idle)}
        className="w-[150px] text-primary-text normal-case border-[1px] border-white/20 h-[56px] font-azeret rounded-[18px] mt-5"
        buttonType="secondary"
      >
        Close
      </Button>
    </>
  );
};

export const stripPrefix = (x: string): string => {
  if (x.startsWith("0x")) {
    return x.slice(2);
  }
  return x;
};

export const EnterSignature = ({
  signature,
  setSignature,
  setStep,
  recordContent,
  record,
  domain,
  close,
}: {
  signature: string;
  setSignature: (x: string) => void;
  setStep: (x: Step) => void;
  recordContent: string;
  record: Record;
  domain: string;
  close: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const { publicKey, signAllTransactions } = useWallet();
  const { toast } = useToastContext();
  const { connection } = useConnection();
  const { theme } = useTheme();

  const handle = async () => {
    if (!publicKey || !signAllTransactions) return;
    try {
      setLoading(true);
      toast.processing();
      const ixs: TransactionInstruction[] = [];

      const ix = ethValidateRecordV2Content(
        domain,
        record,
        publicKey,
        publicKey,
        Buffer.from(stripPrefix(signature), "hex"),
        Buffer.from(stripPrefix(recordContent), "hex")
      );
      ixs.push(ix);

      const results = await makeTxV2({
        connection,
        feePayer: publicKey,
        instructions: ixs,
        signAllTransactions,
        confirmCommitment: "finalized",
      });
      console.log(results);

      if (results.length > 0) {
        toast.success("all");
        close();
      }
    } catch (err) {
      console.log("Error: ", err);
      toast.error();
    } finally {
      setLoading(false);
      await sleep(2000);
      toast.close();
    }
  };

  return (
    <div className="font-azeret w-screen max-w-[800px]">
      <p className="font-azeret text-[16px] text-primary-text">
        Enter Signature
      </p>
      <p className="text-primary-text font-azeret text-[24px] font-medium">
        Step 3 of 3 - Enter Signature Hash
      </p>
      <Divider className="w-full h-[1px] my-5" />
      <div className="flex flex-col items-start space-x-4 md:flex-row">
        <input
          type="text"
          value={signature}
          className="text-primary-text bg-input-bg font-azeret border  border-primary-border rounded-[16px] h-[64px] w-full pl-5"
          placeholder={`Enter Signature Hash`}
          onChange={(e) => setSignature(e.target.value)}
        />
      </div>
      <div className="flex w-full mt-10 space-x-4">
        <button
          onClick={() => setStep(Step.CopyMessage)}
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
          onClick={handle}
          style={{ backgroundImage: "var(--action-button-bg)" }}
          className="w-1/2 h-[47px] rounded-[15px] border-t border-t-top-border-highlight text-action-button-text font-azeret normal-case font-bold text-base"
        >
          {loading ? (
            <div className="w-full flex justify-center">
              <SpinnerFida className="h-[20px]" variant="white" />
            </div>
          ) : (
            "Next"
          )}
        </button>
      </div>
    </div>
  );
};
