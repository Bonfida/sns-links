import { useState, useContext } from "react";
import { useToastContext } from "@bonfida/components";
import SelectedDomainContext from "@/context/selectedDomain";
import { Record } from "@bonfida/spl-name-service";
import { useRecordsV2Guardians } from "@/hooks/useRecordsV2Guardian";
import { useUpdateRecord } from "@/hooks/useUpdateRecord";
import { twMerge } from "tailwind-merge";
import { useTheme } from "next-themes";
import { sleep } from "@/utils";

export const EditPicModal = ({
  currentValue,
  domain,
  refresh,
  close,
}: {
  currentValue: string | undefined;
  domain: string;
  refresh: () => void;
  close: () => void;
}) => {
  const [recordValue, setRecordValue] = useState("");
  const { selectedDomain } = useContext(SelectedDomainContext);
  const { toast } = useToastContext();
  const { theme } = useTheme();
  const { isRoaSupported, sendRoaRequest } = useRecordsV2Guardians(Record.Pic);
  const updateRecord = useUpdateRecord();

  const handleUpdateClick = async () => {
    try {
      await updateRecord({
        domain: domain || selectedDomain,
        recordName: Record.Pic,
        recordValue,
        currentValue,
        isRoaSupported,
        sendRoaRequest,
      });
      refresh();
      await sleep(1_000);
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
        className="relative bg-primary-bg h-fit flex flex-col justify-center items-center border border-primary-border rounded-xl p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex justify-start">
          <span className="text-sm text-primary-text font-azeret font-semibold">
            Image URL
          </span>
        </div>
        <input
          className="bg-input-bg text-primary-text h-[39px] sm:w-[552px] w-[331px] text-center border border-primary-border rounded-lg"
          placeholder="ex:https://imgur.com/..."
          onChange={(event) => {
            setRecordValue(event.target.value);
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
              className="sm:w-[268px] w-[329px]  h-[47px] rounded-[15px] border-t text-action-button-text border-t-top-border-highlight active:border-t-0 font-bold text-base"
              onClick={handleUpdateClick}
            >
              Update
            </button>
            <button
              className={twMerge(
                "sm:w-[268px] w-[329px] h-[47px] rounded-[15px] border-t border-t-top-border-highlight text-white active:border-t-0 font-bold text-base",
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
    </div>
  );
};
