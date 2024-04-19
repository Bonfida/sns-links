import { useState, useContext } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useToastContext } from "@bonfida/components";
import SelectedDomainContext from "@/context/selectedDomain";
import { Record } from "@bonfida/spl-name-service";
import { updateRecord } from "../../../utils/update-record/update-record";
import { useRecordsV2Guardians } from "@/hooks/useRecordsV2Guardian";

const EditRecordModal = ({
  recordName,
  domain,
  close,
}: {
  recordName: string;
  domain: string;
  close: () => void;
}) => {
  const [recordVal, setRecordVal] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(true);
  const { selectedDomain } = useContext(SelectedDomainContext);
  const { connection } = useConnection();
  const { publicKey, signTransaction, signMessage } = useWallet();
  const { toast } = useToastContext();
  const { isRoaSupported, sendRoaRequest } = useRecordsV2Guardians(
    recordName as Record
  );

  console.log("modal called");
  const handleUpdateClick = async (
    recordName: Record,
    selectedDomain: string,
    recordVal: string
  ) => {
    try {
      await updateRecord(
        connection,
        recordName,
        selectedDomain || domain,
        recordVal,
        publicKey,
        signTransaction!,
        signMessage!,
        toast,
        isRoaSupported,
        sendRoaRequest
      );
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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-10 ">
      <div
        className="relative bg-[#03001A] sm:min-w-[880px] h-fit flex flex-col justify-center items-center border border-[#2A2A51] rounded-xl p-5 mt-10 md:mt-0"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl text-white font-azeret">
          {`Edit ${
            recordName.charAt(0).toUpperCase() + recordName.slice(1)
          } record`}
        </h2>
        <div className="bg-gradient-to-r from-transparent to-transparent via-[#7C7CFF] w-full h-[1px] my-5" />
        <input
          className="bg-[#03001A] text-white h-[64px] w-full text-center border border-[#2A2A51] rounded-lg"
          placeholder="Enter new record"
          onChange={(event) => {
            setRecordVal(event.target.value);
          }}
        />
        <div className="flex flex-col items-center justify-center w-full space-y-4">
          <div className="flex items-center justify-center w-full mt-10 space-x-4">
            <button
              className="w-1/2 h-[64px] rounded-[24px] border-opacity-20 border-white border-[1px] text-white bg-[#7C7CFF]"
              onClick={() => {
                handleUpdateClick(
                  recordName as Record,
                  selectedDomain,
                  recordVal
                );
              }}
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRecordModal;
