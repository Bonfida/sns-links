import { useEffect } from "react";
import axios from "axios";
import { Divider } from "../../Divider";
import { useState } from "react";
import { makeTx } from "../../../utils/send-tx";
import { extractErrorMessage } from "../../../utils/extract-error-message";
import { SpinnerFida } from "../../spinner";
import { sleep } from "../../../utils/sleep";
import { isPubkey } from "@bonfida/hooks";
import { derive } from "../../../utils/name-service";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import {
  createNameRegistry,
  NameRegistryState,
  updateInstruction,
  NAME_PROGRAM_ID,
  Numberu32,
  Record,
  transferInstruction,
  serializeRecord,
  RecordV2,
  Signature,
  getMessageToSign,
  serializeSolRecord,
  createRecordV2Instruction,
  updateRecordV2Instruction,
  getRecordKeySync,
  deleteInstruction,
  deleteRecordV2,
  getRecordV2Key,
  UserSig,
} from "@bonfida/spl-name-service";
import {
  useUserContext,
  useToastContext,
  useRecordsV2Guardians,
} from "../../../hooks";
import { RenderStepsNumbers } from "./StepsNumbers";
import { SetValueStep, SignStep, VerifyStep, ReviewStep } from "./steps";

const USERNAME_RECORDS = [
  Record.Discord,
  Record.Github,
  Record.Reddit,
  Record.Twitter,
  Record.Telegram,
  Record.Backpack,
];

export type CurrentStep = 1 | 2 | 3 | 4;

/**
 * Some records allow users to enter the value in several formats
 * (for Backpack: with or without `@` at the start) but we need to
 * store/sign/verify only valid ones.
 *
 * @example
 * formatRecordValue(value, Record.Backpack)
 */
const formatRecordValue = (value: string, record: Record) => {
  if (!value) return value;

  if (USERNAME_RECORDS.includes(record)) {
    return value.replace(/^@/, "");
  }

  return value;
};

export const EditRecordModal = ({
  record,
  domain,
  setVisible,
  refresh,
  currentValue,
}: {
  record: Record;
  domain: string;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: () => void;
  currentValue: string | undefined;
}) => {
  const { beta } = useUserContext();
  const { connection } = useConnection();
  const { publicKey, signTransaction, signMessage } = useWallet();
  const { toast } = useToastContext();
  const {
    isRecordSupported: isVerificationSupported,
    getBackpackGuardianSignature,
  } = useRecordsV2Guardians(record);

  const [checked, setChecked] = useState(false);
  const [initialValue, setInitialValue] = useState(currentValue ?? "");
  const [value, setValue] = useState(initialValue);
  const [isLoading, setLoading] = useState(false);

  const [userSignature, setUserSignature] = useState<Signature | null>(null);
  const [guardianSignature, setGuardianSignature] = useState<Signature | null>(
    null
  );
  const [isVerificationFailed, setVerificationFailed] = useState(false);

  const [ignoreUserSign, toggleIgnoreUserSign] = useState(false);
  const [ignoreGuardianSign, toggleIgnoreGuardianSign] = useState(false);

  const [currentStep, setStep] = useState<CurrentStep>(1);

  // If user already signed, but then selected checkbox, we need to delete
  // signature
  useEffect(() => {
    if (ignoreUserSign === true) {
      setUserSignature(null);
    }
  }, [ignoreUserSign]);

  useEffect(() => {
    if (ignoreGuardianSign === true) {
      setGuardianSignature(null);
      setVerificationFailed(false);
    }
  }, [ignoreGuardianSign]);

  useEffect(() => {
    setVerificationFailed(false);
  }, [currentStep, value]);

  useEffect(() => {
    setInitialValue(currentValue ?? "");
  }, [currentValue]);

  useEffect(() => {
    setUserSignature(null);
    setGuardianSignature(null);
  }, [value]);

  const handle = async () => {
    if (!publicKey || !signTransaction || !signMessage) return;

    try {
      setLoading(true);
      const formattedValue = formatRecordValue(value, record);
      const instructions: TransactionInstruction[] = [];

      const sub = Buffer.from([1]).toString() + record;
      const recordKey = beta
        ? getRecordV2Key(domain, record)
        : getRecordKeySync(domain, record);
      const { pubkey: parentKey } = await derive(domain);

      const creationInstruction = async () => {
        let ix: TransactionInstruction;

        if (beta) {
          ix = await createRecordV2Instruction(
            connection,
            domain,
            record,
            RecordV2.new(
              formattedValue,
              record,
              userSignature || undefined,
              guardianSignature || undefined
            ),
            publicKey,
            publicKey
          );
        } else {
          const lamports = await connection.getMinimumBalanceForRentExemption(
            space + NameRegistryState.HEADER_LEN
          );
          ix = await createNameRegistry(
            connection,
            sub,
            space,
            publicKey,
            publicKey,
            lamports,
            undefined,
            parentKey
          );
        }
        return ix;
      };

      const deletionInstruction = async () => {
        return beta
          ? await deleteRecordV2(domain, record, publicKey, publicKey)
          : deleteInstruction(NAME_PROGRAM_ID, recordKey, publicKey, publicKey);
      };

      // Delete the record if empty input and return
      if (formattedValue === "") {
        const { signature, success } = await makeTx(
          connection,
          publicKey,
          [await deletionInstruction()],
          signTransaction,
          toast
        );
        toast.close();
        console.log(signature, success);
        await sleep(1_000);
        refresh();
        setLoading(false);
        setVisible(false);
        return;
      }

      if (record === Record.SOL && !isPubkey(formattedValue)) {
        return toast.error("The record must be a valid wallet address");
      }

      if (USERNAME_RECORDS.includes(record) && value.startsWith("https://")) {
        return toast.error("The record must contain your username not a link");
      }

      if (record === Record.Url) {
        try {
          new URL(formattedValue);
        } catch (err) {
          setLoading(false);
          return toast.error("Invalid URL");
        }
      } else if (record === Record.IPFS) {
        if (!formattedValue.startsWith("ipfs://")) {
          setLoading(false);
          return toast.error("Invalid IPFS record - Must start with ipfs://");
        }
      } else if (record === Record.ARWV) {
        if (!formattedValue.startsWith("arw://")) {
          setLoading(false);
          return toast.error("Invalid Arweave record");
        }
      }

      let ser: Buffer = new Buffer([]);

      if (!beta) {
        if (record === Record.SOL) {
          const toSign = Buffer.concat([
            new PublicKey(formattedValue).toBuffer(),
            recordKey.toBuffer(),
          ]);
          toast.processing();
          const encodedMessage = new TextEncoder().encode(
            toSign.toString("hex")
          );
          const signed = await signMessage(encodedMessage);
          ser = serializeSolRecord(
            new PublicKey(formattedValue),
            recordKey,
            publicKey,
            signed
          );
        } else {
          ser = serializeRecord(formattedValue, record);
        }
      }

      const space = ser.length;
      const currentAccount = await connection.getAccountInfo(recordKey);

      /**
       * Check if record is associated with the current wallet.
       *
       * If YES, then user is trying to update the existing value. So we need to
       * firstly remove old record's value, and then add it again.
       *
       * If NO, then we need to add record to registry.
       */
      const isRecordExistsInRegistry = currentAccount?.data;
      if (!isRecordExistsInRegistry) {
        instructions.push(await creationInstruction());
      } else {
        const { registry } = await NameRegistryState.retrieve(
          connection,
          recordKey
        );

        if (!registry.owner.equals(publicKey)) {
          // Record was created before domain was transfered
          const ix = transferInstruction(
            NAME_PROGRAM_ID,
            recordKey,
            publicKey,
            registry.owner,
            undefined,
            parentKey,
            publicKey
          );
          instructions.push(ix);
        }

        const recordValueChanged =
          currentAccount.data.length - NameRegistryState.HEADER_LEN !== space;
        if (recordValueChanged) {
          /**
           * If record's value is changed, we need to remove old value and
           * create a new value. This action is non-transactional so we need
           * to ask user to sign deletion separately.
           */
          const { signature, success } = await makeTx(
            connection,
            publicKey,
            [await deletionInstruction()],
            signTransaction,
            toast
          );
          toast.close();
          console.log(signature, success);

          instructions.push(await creationInstruction());
        }
      }

      if (beta) {
        const ixs = await updateRecordV2Instruction(
          connection,
          domain,
          record,
          RecordV2.new(
            formattedValue,
            record,
            userSignature || undefined,
            guardianSignature || undefined
          ),
          publicKey,
          publicKey
        );
        instructions.push(...ixs);
      } else {
        const ix = updateInstruction(
          NAME_PROGRAM_ID,
          recordKey,
          new Numberu32(0),
          ser,
          publicKey
        );

        instructions.push(ix);
      }

      const { signature, success } = await makeTx(
        connection,
        publicKey,
        instructions,
        signTransaction,
        toast
      );
      console.log(signature, success);
      await sleep(1_000);
      refresh();
      setLoading(false);
      setVisible(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const createSignature = async () => {
    try {
      if (!signMessage) return;
      setLoading(true);

      const messageBuffer = getMessageToSign(
        formatRecordValue(value, record),
        domain,
        record
      );
      const signed = await signMessage(messageBuffer);
      setUserSignature({
        signatureType: UserSig.Solana,
        signature: signed as Buffer,
      });
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const verifyRecord = async () => {
    try {
      setLoading(true);
      const signature = await getBackpackGuardianSignature(
        domain,
        formatRecordValue(value, record)
      );

      if (!signature) return;

      setVerificationFailed(false);
      setGuardianSignature({
        signatureType: UserSig.Solana,
        signature: Buffer.from(signature, "hex"),
      });
    } catch (err) {
      const isAxiosError = axios.isAxiosError(err);

      if (isAxiosError) {
        setVerificationFailed(true);
      } else {
        toast.error(extractErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const isCreationFlow = !initialValue;
  const isDeletionFlow = Boolean(initialValue && !value);

  return (
    <div className="flex flex-col">
      <p className="text-lg font-medium text-white font-azeret md:text-2xl">
        Edit {record} record (Experimental)
      </p>
      <Divider className="w-full h-[1px] my-5" />

      {beta && (
        <RenderStepsNumbers
          currentStep={currentStep}
          setStep={setStep}
          containerClassName="mb-6 mx-auto"
          isVerificationSupported={isVerificationSupported}
          isDeletionFlow={isDeletionFlow}
        />
      )}

      {currentStep === 1 && (
        <SetValueStep
          record={record}
          domain={domain}
          value={value}
          setValue={setValue}
          checked={checked}
          setChecked={setChecked}
          isLoading={isLoading}
          onNextClick={beta ? () => setStep(isDeletionFlow ? 4 : 2) : handle}
          nextContent={beta ? "Next" : "Update"}
          nextDisabled={record === Record.SOL && !checked}
          onBackClick={() => setVisible(false)}
          backContent="Close"
        />
      )}

      {currentStep === 2 && (
        <SignStep
          ignoreUserSign={ignoreUserSign}
          toggleIgnoreUserSign={toggleIgnoreUserSign}
          isLoading={isLoading}
          onNextClick={
            ignoreUserSign
              ? () => setStep(isVerificationSupported ? 3 : 4)
              : value && !userSignature
              ? createSignature
              : () => setStep(isVerificationSupported ? 3 : 4)
          }
          nextContent={
            <>
              {isLoading && <SpinnerFida className="h-[20px]" />}

              {!isLoading && (
                <>
                  {ignoreUserSign
                    ? "Next"
                    : value && !userSignature
                    ? "Set signature"
                    : "Next"}
                </>
              )}
            </>
          }
          onBackClick={() => setStep(1)}
          backContent="Back"
        />
      )}

      {currentStep === 3 && isVerificationSupported && (
        <VerifyStep
          isVerificationFailed={isVerificationFailed}
          value={formatRecordValue(value, record)}
          ignoreGuardianSign={ignoreGuardianSign}
          toggleIgnoreGuardianSign={toggleIgnoreGuardianSign}
          isLoading={isLoading}
          onNextClick={
            ignoreGuardianSign
              ? () => setStep(4)
              : !guardianSignature
              ? verifyRecord
              : () => setStep(4)
          }
          nextContent={
            <>
              {isLoading && <SpinnerFida className="h-[20px]" />}

              {!isLoading && (
                <>
                  {ignoreGuardianSign
                    ? "Next"
                    : !guardianSignature
                    ? `Verify ${record}`
                    : "Next"}
                </>
              )}
            </>
          }
          onBackClick={() => setStep(2)}
          backContent="Back"
        />
      )}

      {currentStep === 4 && (
        <ReviewStep
          isCreationFlow={isCreationFlow}
          isDeletionFlow={isDeletionFlow}
          value={formatRecordValue(value, record)}
          initialValue={initialValue}
          userSignature={userSignature}
          guardianSignature={guardianSignature}
          setStep={setStep}
          isVerificationSupported={isVerificationSupported}
          isLoading={isLoading}
          onNextClick={handle}
          nextContent={
            isLoading ? <SpinnerFida className="h-[20px]" /> : "Update"
          }
          onBackClick={() =>
            setStep(isDeletionFlow ? 1 : isVerificationSupported ? 3 : 2)
          }
          backContent="Back"
        />
      )}
    </div>
  );
};
