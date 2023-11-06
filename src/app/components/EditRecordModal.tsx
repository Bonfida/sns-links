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
} from "@bonfida/spl-name-service";
import { derive } from "../../utils/derive";

const EditRecordModal = ({ recordToUpdate, setEditingRecord }) => {
  const recordName = recordToUpdate[0];
  const [recordVal, setRecordVal] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(true);
  const { selectedDomain } = useContext(SelectedDomainContext);
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const { toast } = useToastContext();

  const closeModal = () => {
    setIsModalVisible(false);
    setEditingRecord(false);
  };

  const handleUpdateClick = async () => {
    try {
      await updateRecord(recordName, selectedDomain, recordVal);
    } catch (error) {
      console.error("Failed to update record:", error);
      toast.error(`Failed to update record: ${error.message}`);
    }
  };

  const updateRecord = async (recordName, domain, recordVal) => {
    const instructions = [];
    const { pubkey: parentKey } = await derive(domain);
    const recordKey = await derive(domain, recordName);
    const space = serializeRecord(recordVal, recordName).length;
    const lamports = await connection.getMinimumBalanceForRentExemption(
      space + NameRegistryState.HEADER_LEN
    );

    const transaction = new Transaction();
    const { blockhash } = await connection.getRecentBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = new PublicKey(publicKey);
    const currentAccount = await connection.getAccountInfo(recordKey);
    if (!currentAccount) {
      instructions.push(
        await createNameRegistry(
          connection,
          recordName,
          space,
          transaction.feePayer,
          transaction.feePayer,
          lamports,
          undefined,
          parentKey
        )
      );
    } else {
      instructions.push(
        deleteInstruction(recordKey, transaction.feePayer, publicKey)
      );
      instructions.push(
        await createNameRegistry(
          connection,
          recordName,
          space,
          transaction.feePayer,
          transaction.feePayer,
          lamports,
          undefined,
          parentKey
        )
      );
    }

    instructions.push(
      updateInstruction(
        recordKey,
        new Uint8Array(serializeRecord(recordVal, recordName)),
        transaction.feePayer
      )
    );

    instructions.forEach((instruction) => transaction.add(instruction));

    try {
      const signedTransaction = await signTransaction(transaction);
      const rawTransaction = signedTransaction.serialize();
      const { signature } = await connection.sendRawTransaction(rawTransaction);
      await connection.confirmTransaction(signature);
      toast.success(`Transaction successful with signature: ${signature}`);
    } catch (err) {
      console.error("Error sending transaction:", err);
      toast.error(`Error sending transaction: ${err.message}`);
    }
  };

  return (
    <>
      {isModalVisible && (
        <div
          className="fixed inset-0 bg-white bg-opacity-10 flex justify-center items-center"
          onClick={closeModal}
        >
          <div
            className="bg-[#03001A] sm:min-w-[880px] h-fit flex flex-col justify-center items-center border border-[#2A2A51] rounded-lg p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="font-azeret text-white text-xl">
              Edit {recordName} record
            </h1>
            <div className="bg-gradient-to-r from-transparent to-transparent via-[#7C7CFF] w-full h-[1px] my-5" />
            <input
              className="bg-[#03001A] text-white h-[64px] w-full text-center border border-[#2A2A51] rounded-lg"
              placeholder="Enter new record"
              onChange={(event) => {
                setRecordVal(event.target.value);
              }}
            />
            <div className="flex justify-between items-center w-full mt-10 space-x-4">
              <button
                className="w-1/2 h-[64px] rounded-[24px] border-opacity-20 border-white border-[1px] text-white font-azeret"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="w-1/2 h-[64px] rounded-[24px] border-opacity-20 border-white border-[1px] text-white font-azeret"
                onClick={handleUpdateClick}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditRecordModal;
