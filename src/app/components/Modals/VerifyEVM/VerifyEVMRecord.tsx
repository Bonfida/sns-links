import { Record } from "@bonfida/spl-name-service";
import { useState } from "react";
import { HowDoesItWork } from "./HowDoesItWork";
import { CopyMessage } from "./CopyMessage";
import { EnterSignature } from "./EnterSignature";

export enum Step {
  HowDoesItWork,
  CopyMessage,
  EnterSignature,
}

export const VerifyEvmRecordsV2 = ({
  record,
  domain,
  close,
  recordContent,
}: {
  record: Record;
  domain: string;
  close: () => void;
  recordContent: string;
}) => {
  const [step, setStep] = useState(Step.HowDoesItWork);
  const [signature, setSignature] = useState("");
  return (
    <>
      {step === Step.HowDoesItWork && (
        <HowDoesItWork setStep={setStep} close={close} />
      )}
      {step === Step.CopyMessage && (
        <CopyMessage
          record={record}
          setStep={setStep}
          domain={domain}
          recordContent={recordContent}
        />
      )}
      {step === Step.EnterSignature && (
        <EnterSignature
          signature={signature}
          setSignature={setSignature}
          setStep={setStep}
          recordContent={recordContent}
          record={record}
          domain={domain}
          close={close}
        />
      )}
    </>
  );
};
