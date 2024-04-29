import { useState, useContext } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useToastContext } from "@bonfida/components";
import SelectedDomainContext from "@/context/selectedDomain";
import { Record } from "@bonfida/spl-name-service";
import { useRecordsV2Guardians } from "@/hooks/useRecordsV2Guardian";
import { useUpdateRecord } from "@/hooks/useUpdateRecord";

export const EditPicModal = ({
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
  const { publicKey, signTransaction, signMessage } = useWallet();
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
      await updateRecord({
        domain: domain || selectedDomain,
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
    <div className="fixed inset-0 flex items-center justify-center">
      <div
        className="relative bg-modal-bg h-fit flex flex-col justify-center items-center border border-modal-border rounded-xl p-5 mt-10 md:mt-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex justify-start">
          <span className="text-sm text-modal-text font-azeret font-semibold">
            Image URL
          </span>
        </div>
        <input
          className="bg-modal-input-bg text-modal-text h-[39px] sm:w-[552px] w-[331px] text-center border border-modal-border rounded-lg"
          placeholder="ex:https://imgur.com/..."
          onChange={(event) => {
            setRecordVal(event.target.value);
          }}
        />
        <div className="w-full justify-start">
          <button className="flex font-semibold text-sm text-link">
            PASTE
          </button>
        </div>

        <div className="flex flex-col items-center justify-center w-full space-y-4">
          <div className="flex flex-col gap-y-3 sm:flex-row items-center justify-between w-full mt-6 space-x-1.5">
            <button
              style={{ backgroundImage: "var(--action-button-bg)" }}
              className="sm:w-[268px] w-[329px]  h-[47px] rounded-[24px] border-t text-action-button-text border-t-action-button-border active:border-t-0 font-bold"
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
              className="sm:w-[268px] w-[329px] h-[47px] rounded-[24px] border-t text-modal-text bg-gradient-to-b from-glass-bg to-bg-modal-bg border-t-modal-border active:border-t-0 font-bold"
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
