import { useState, useContext } from "react";
import { useToastContext } from "@bonfida/components";
import SelectedDomainContext from "@/context/selectedDomain";
import { Record } from "@bonfida/spl-name-service";
import { useUpdateRecord } from "@/hooks/useUpdateRecord";
import { useRecordsV2Guardians } from "@/hooks/useRecordsV2Guardian";
import { twMerge } from "tailwind-merge";
import { useTheme } from "next-themes";
import { useRecordsV2 } from "@/hooks/useRecordsV2";
import { sleep } from "@/utils";

const recordPlaceholderTextMap = new Map<Record, string>([
  [Record.ARWV, "0x..."],
  [Record.SOL, "SOL..."],
  [Record.ETH, "0x..."],
  [Record.BTC, "bc1..."],
  [Record.LTC, "3CD..."],
  [Record.DOGE, "0x..."],
  [Record.Email, "user@..."],
  [Record.Url, "https://..."],
  [Record.Discord, "username..."],
  [Record.Github, "https://github.com/..."],
  [Record.Reddit, "https://reddit.com/user/..."],
  [Record.Twitter, "username..."],
  [Record.Telegram, "username..."],
  [Record.Pic, "https://..."],
  [Record.SHDW, "SHDW..."],
  [Record.POINT, "0x..."],
  [Record.BSC, "0x..."],
  [Record.Injective, "0x..."],
  [Record.Backpack, "username..."],
]);

const EditRecordModal = ({
  recordName,
  domain,
  currentValue,
  close,
}: {
  recordName: Record;
  domain: string;
  currentValue: string | undefined;
  close: () => void;
}) => {
  const [recordVal, setRecordVal] = useState("");
  const { selectedDomain } = useContext(SelectedDomainContext);
  const { toast } = useToastContext();
  const { isRoaSupported, sendRoaRequest } = useRecordsV2Guardians(
    recordName as Record
  );
  const { theme } = useTheme();
  const updateRecord = useUpdateRecord();

  const { refetch } = useRecordsV2(domain);

  const handleUpdateClick = async (
    recordName: Record,
    selectedDomain: string,
    recordValue: string
  ) => {
    try {
      await updateRecord({
        domain: selectedDomain || domain,
        recordName,
        recordValue,
        currentValue,
        isRoaSupported,
        sendRoaRequest,
      });
      await refetch();
      await sleep(800);
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
    <div
      className="relative bg-primary-bg h-fit flex flex-col justify-center items-center border border-primary-border rounded-2xl p-6 gap-y-3"
      onClick={(e) => e.stopPropagation()}
    >
      <div>
        <div className="w-full flex justify-start">
          <h2 className="text-sm text-primary-text font-azeret font-semibold">
            {recordName.charAt(0).toUpperCase() + recordName.slice(1)}
          </h2>
        </div>
        <input
          className="bg-glass-bg text-primary-text h-[113px] sm:w-[552px] w-[331px] text-center border border-primary-border rounded-2xl"
          placeholder={recordPlaceholderTextMap.get(recordName)}
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
            className="sm:w-[268px] w-[329px] h-[47px] rounded-[15px]  border-t text-action-button-text  border-t-primary-border active:border-t-0 font-bold text-base"
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
            className={twMerge(
              "sm:w-[268px] w-[329px] h-[47px] rounded-[15px] border-t text-white bg-gradient-to-b from-glass-bg to-bg-primary-bg  border-t-top-border-highlight active:border-t-0 font-bold text-base",
              theme === "dark"
                ? "bg-gradient-to-b from-glass-bg to-bg-primary-bg"
                : "bg-edit-button-bg"
            )}
            onClick={() => {
              close();
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditRecordModal;
