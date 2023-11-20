import { useState, useContext } from "react";
import { PublicKey, Transaction } from "@solana/web3.js";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useToastContext } from "@bonfida/components";
import SelectedDomainContext from "@/context/selectedDomain";
import {
  serializeRecord,
  createNameRegistry,
  updateInstruction,
  deleteInstruction,
  NameRegistryState,
  getRecordKeySync,
  createInstruction,
  NAME_PROGRAM_ID,
  Numberu32,
  serializeSolRecord,
  transferInstruction,
  getMessageToSign,
  Signature,
  UserSig,
  Record,
} from "@bonfida/spl-name-service";
import { derive } from "../../utils/derive";
import { isPubkey } from "@/utils/isPubkey";
import { formatRecordValue } from "@/utils/formatRecordValue";
import { makeTx } from "@/utils/makeTx";
import { sleep } from "../../utils/sleep";
import { extractErrorMessage } from "@/utils/extractErrorMessage";
import { recordsToFetch } from "../constants/recordsToFetch";
const USERNAME_RECORDS = [
  Record.Discord,
  Record.Github,
  Record.Reddit,
  Record.Twitter,
  Record.Telegram,
  Record.Backpack,
];

const EditRecordModal = ({
  recordName,
  setIsEditingRecord,
  setIsEditingPic,
}: {
  recordName: string;
  setIsEditingRecord: (isEditing: boolean) => void;
  setIsEditingPic: (isEditing: boolean) => void;
}) => {
  console.log("RecordName: ", recordName);
  const [recordVal, setRecordVal] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(true);
  const { selectedDomain } = useContext(SelectedDomainContext);
  const { connection } = useConnection();
  const { publicKey, signTransaction, signMessage } = useWallet();
  const { toast } = useToastContext();
  const [userSignature, setUserSignature] = useState<Signature | null>(null);

  const closeModal = () => {
    setIsModalVisible(false);
    setIsEditingRecord(false);
    setIsEditingPic(false);
  };

  const handleUpdateClick = async () => {
    try {
      await updateRecord(recordName, selectedDomain, recordVal);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to update record:", error);
        toast.error(`Failed to update record: ${error.message}`);
      } else {
        console.error("An unknown error occurred:", error);
        toast.error("Failed to update record: An unknown error occurred");
      }
    }
  };

  const handleDeleteClick = async () => {
    try {
      await updateRecord(recordName, selectedDomain, "");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to update record:", error);
        toast.error(`Failed to update record: ${error.message}`);
      } else {
        console.error("An unknown error occurred:", error);
        toast.error("Failed to update record: An unknown error occurred");
      }
    }
  };

  const updateRecord = async (
    recordName: string,
    domain: string,
    recordVal: string
  ) => {
    try {
      if (!publicKey || !signTransaction || !signMessage) return;
      //format value for usernames that include "@"
      const formattedValue = formatRecordValue(
        recordVal,
        recordName.toLowerCase()
      );

      const instructions = [];
      const sub = Buffer.from([1]).toString() + recordName;
      const { pubkey: parentKey } = await derive(domain);
      const recordKey = getRecordKeySync(domain, recordName);

      const creationInstruction = async () => {
        const lamports = await connection.getMinimumBalanceForRentExemption(
          space + NameRegistryState.HEADER_LEN
        );

        let ix = await createNameRegistry(
          connection,
          sub,
          space,
          publicKey!,
          publicKey!,
          lamports,
          undefined,
          parentKey
        );
        return ix;
      };

      const deletionInstruction = async () => {
        return deleteInstruction(
          NAME_PROGRAM_ID,
          recordKey,
          publicKey!,
          publicKey!
        );
      };

      if (formattedValue === "") {
        const { signature, success } = await makeTx(
          connection,
          publicKey!,
          [await deletionInstruction()],
          signTransaction,
          toast
        );
        toast.close();
        console.log(signature, success);
        await sleep(1_000);
        return;
      }

      // Checks for various record types
      if (recordName === Record.SOL && !isPubkey(formattedValue)) {
        return toast.error("The record must be a valid wallet address");
      }

      if (
        USERNAME_RECORDS.includes(recordName) &&
        recordVal.startsWith("https://")
      ) {
        return toast.error("The record must contain your username not a link");
      }

      if (recordName === Record.Url) {
        try {
          new URL(formattedValue);
        } catch (err) {
          return toast.error("Invalid URL");
        }
      } else if (recordName === Record.IPFS) {
        if (!formattedValue.startsWith("ipfs://")) {
          return toast.error("Invalid IPFS record - Must start with ipfs://");
        }
      } else if (recordName === Record.ARWV) {
        if (!formattedValue.startsWith("arw://")) {
          return toast.error("Invalid Arweave record");
        }
      }

      let ser = new Buffer([]);

      if (recordName === Record.SOL) {
        const toSign = Buffer.concat([
          new PublicKey(formattedValue).toBuffer(),
          recordKey.toBuffer(),
        ]);
        toast.processing();
        const encodedMessage = new TextEncoder().encode(toSign.toString("hex"));
        const signed = await signMessage(encodedMessage);
        ser = serializeSolRecord(
          new PublicKey(formattedValue),
          recordKey,
          publicKey,
          signed
        );
      } else {
        ser = serializeRecord(formattedValue, recordName);
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
      console.log("currectAccount", currentAccount);

      if (!isRecordExistsInRegistry) {
        instructions.push(await creationInstruction());
      } else {
        const { registry } = await NameRegistryState.retrieve(
          connection,
          recordKey
        );

        if (!registry.owner.equals(publicKey)) {
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

      const ix = updateInstruction(
        NAME_PROGRAM_ID,
        recordKey,
        new Numberu32(0),
        ser,
        publicKey
      );
      instructions.push(ix);

      const { signature, success } = await makeTx(
        connection,
        publicKey,
        instructions,
        signTransaction,
        toast
      );
      console.log(signature, success);
      await sleep(1_000);
    } catch (err) {
      console.log(err);
    }
  };

  const createSignature = async () => {
    try {
      if (!signMessage) return;

      const messageBuffer = getMessageToSign(
        formatRecordValue(recordVal, recordName),
        domain,
        recordName
      );
      const signed = await signMessage(messageBuffer);
      setUserSignature({
        signatureType: UserSig.Solana,
        signature: signed as Buffer,
      });
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      console.log("complete!");
    }
  };

  return (
    <>
      {isModalVisible && (
        <div
          className="fixed inset-0 bg-white bg-opacity-10 flex justify-center items-center "
          onClick={closeModal}
        >
          <div
            className="bg-[#03001A] sm:min-w-[880px] h-fit flex flex-col justify-center items-center border border-[#2A2A51] rounded-lg p-5 mt-10 md:mt-0"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="font-azeret text-white text-xl">
              {`Edit ${
                recordName.charAt(0).toUpperCase() + recordName.slice(1)
              } record`}
            </h1>
            <div className="bg-gradient-to-r from-transparent to-transparent via-[#7C7CFF] w-full h-[1px] my-5" />
            <input
              className="bg-[#03001A] text-white h-[64px] w-full text-center border border-[#2A2A51] rounded-lg"
              placeholder="Enter new record"
              onChange={(event) => {
                setRecordVal(event.target.value);
              }}
            />
            <div className="flex flex-col items-center justify-center w-full space-y-4">
              <div className="flex justify-between items-center w-full mt-10 space-x-4">
                <button
                  className="w-1/2 h-[64px] rounded-[24px] border-opacity-20 border-white border-[1px] text-white font-azeret"
                  onClick={handleUpdateClick}
                >
                  Update
                </button>
                <button
                  className="w-1/2 h-[64px] rounded-[24px] border-opacity-20 border-white border-[1px] text-white font-azeret"
                  onClick={handleDeleteClick}
                >
                  Delete
                </button>
              </div>
              <button
                className="w-1/2 h-[64px] rounded-[24px] border-opacity-20 border-white border-[1px] text-white font-azeret"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditRecordModal;
