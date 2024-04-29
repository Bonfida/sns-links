import { useState, useContext } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useToastContext } from "@bonfida/components";
import SelectedDomainContext from "@/context/selectedDomain";
import { Record } from "@bonfida/spl-name-service";
import { useUpdateRecord } from "@/hooks/useUpdateRecord";
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
  const { selectedDomain } = useContext(SelectedDomainContext);
  const { connection } = useConnection();
  const { publicKey, signAllTransactions, signMessage } = useWallet();
  const { toast } = useToastContext();
  const { isRoaSupported, sendRoaRequest } = useRecordsV2Guardians(
    recordName as Record
  );
  const updateRecord = useUpdateRecord();

  const handleUpdateClick = async (
    recordName: Record,
    selectedDomain: string,
    recordVal: string
  ) => {
    try {
      updateRecord({
        domain: selectedDomain || domain,
        recordName,
        recordVal,
        isRoaSupported,
        sendRoaRequest,
      });
      close();
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
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-10">
      <div
        className="relative bg-modal-bg h-fit flex flex-col justify-center items-center border border-modal-border rounded-2xl p-6 gap-y-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <div className="w-full flex justify-start">
            <h2 className="text-sm text-[#F8EFF9CC] font-azeret font-semibold">
              {recordName.charAt(0).toUpperCase() + recordName.slice(1)}
            </h2>
          </div>
          <input
            className="bg-[#FFFFFF12] text-modal-text h-[113px] sm:w-[552px] w-[331px] text-center border border-modal-border rounded-2xl"
            placeholder="Enter new record"
            onChange={(event) => {
              setRecordVal(event.target.value);
            }}
          />
          <div className="w-full justify-start">
            <button className="flex font-semibold text-sm text-link">
              PASTE
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center w-full space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row items-center justify-between w-full mt-6 ">
            <button
              style={{ backgroundImage: "var(--action-button-bg)" }}
              className="sm:w-[268px] w-[329px] h-[47px] rounded-[24px]  border-t text-action-button-text  border-t-modal-border active:border-t-0 font-bold text-base"
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
            <button
              className="sm:w-[268px] w-[329px] h-[47px] rounded-[24px] border-t text-modal-text bg-gradient-to-b from-glass-bg to-bg-modal-bg   border-t-modal-border active:border-t-0 font-bold text-base"
              onClick={() => {
                close();
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRecordModal;
