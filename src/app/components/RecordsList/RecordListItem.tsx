import Image from "next/image";
import { ButtonModal } from "../ButtonModal";
import { useState } from "react";
import EditRecordModal from "../Modals/EditRecordModal";
import { useIsTokenized } from "@/hooks/useIsTokenized";
import UnwrapModal from "../Modals/UnwrapModal";
import { twMerge } from "tailwind-merge";
import { useTheme } from "next-themes";
import { useQueryClient } from "react-query";
import { useUpdateRecord } from "@/hooks/useUpdateRecord";
import { Record } from "@bonfida/spl-name-service";
import { EVM_RECORDS } from "@/utils/update-roa";
import { useUpdateROA } from "@/hooks/useUpdateROA";
import { SpinnerFida } from "@bonfida/components";
import { ModalWrapper } from "../Modals/ModalWrapper";
import { VerifyEvmRecordsV2 } from "../Modals/VerifyEVM/VerifyEVMRecord";

const verifiableRecords = [
  Record.SOL,
  Record.CNAME,
  Record.ETH,
  Record.BSC,
  Record.Injective,
  Record.Url,
];

type EvmVerifyState = {
  visible: boolean;
  record?: Record;
  content?: string;
};

export const RecordListItem = ({
  record,
  domain,
  isOwner,
}: {
  record: { record: Record; content?: string | undefined };
  domain: string;
  isOwner: boolean;
}) => {
  // Visibility
  const [isModalVisible, setModalVisible] = useState(false);
  const [evmVerify, setEvmVerify] = useState<EvmVerifyState>({
    visible: false,
  });
  const [isVerificationLoading, setIsVerificationLoading] = useState(false);

  // Misc.
  const queryClient = useQueryClient();
  const { theme } = useTheme();

  // Is NFT
  const { data: isToken } = useIsTokenized(domain);
  const refreshIsToken = queryClient.invalidateQueries(["isTokenized", domain]);

  //Handlers
  const deleteRecord = useUpdateRecord();
  const handleDelete = async () => {
    try {
      await deleteRecord({
        domain,
        recordName: record.record,
        recordValue: "",
        currentValue: record.content,
      });
    } catch (err) {
      console.log("Error: ", err);
    } finally {
      await queryClient.invalidateQueries(["records", domain]);
    }
  };

  const updateROA = useUpdateROA();
  const handleRoa = async () => {
    if (EVM_RECORDS.includes(record.record)) {
      return setEvmVerify((prev) => ({
        visible: true,
        content: record.content,
        record: record.record,
      }));
    }

    try {
      await updateROA({ domain, record: record.record });
    } catch (err) {
      console.log("Error: ", err);
    } finally {
      await queryClient.invalidateQueries(["records", domain]);
    }
  };

  return (
    <div className="w-full flex flex-col bg-list-item-bg border-t-[1px] border-white/[24%] rounded-3xl ">
      <div className="flex justify-between w-full pt-2 pb-2 pl-5 pr-2 h-[65px]">
        <div className="space-x-2 flex justify-center items-center">
          <span className="text-primary-text text-lg">
            {record.record.charAt(0).toUpperCase() + record.record.slice(1)}
          </span>
        </div>
        {isOwner && (
          <div className="flex gap-2 justify-center items-center">
            {record.content && verifiableRecords.includes(record.record) && (
              <button
                className="border-white/10 bg-[#13122B]/90 border-[1px] rounded-lg px-4 py-2 text-xs text-white ml-2"
                type="button"
                onClick={handleRoa}
              >
                {isVerificationLoading ? (
                  <SpinnerFida
                    variant={theme === "dark" ? "white" : "color"}
                    className="h-[18px]"
                  />
                ) : (
                  "Verify"
                )}
              </button>
            )}
            <ButtonModal
              buttonClass={twMerge(
                "text-sm w-[50px] px-1 py-3 rounded-[16px] flex items-center justify-center border-t border-t-top-border-highlight active:border-t-0",
                theme === "dark"
                  ? "bg-gradient-to-b from-glass-bg to-edit-button-bg"
                  : "bg-edit-button-bg"
              )}
              buttonText={
                <Image
                  src="/pen/pen.svg"
                  alt="edit records"
                  width={24}
                  height={24}
                />
              }
              modalClass="px-1 sm:px-0"
              visible={isModalVisible}
              setVisible={setModalVisible}
            >
              {isToken ? (
                <UnwrapModal
                  domain={domain}
                  refresh={() => refreshIsToken}
                  close={() => setModalVisible(false)}
                />
              ) : (
                <EditRecordModal
                  recordName={record.record}
                  domain={domain}
                  currentValue={record.content}
                  close={() => setModalVisible(false)}
                />
              )}
            </ButtonModal>
          </div>
        )}
      </div>
      {record.content && (
        <div className="w-full border-t-white/25 border-t h-[39px] pt-2 py-[14px] pl-5 pr-[26px] flex justify-between">
          <span
            className={twMerge(
              theme === "dark" ? "text-[#F8EFF9]/50" : "text-primary-text/90",
              "text-base font-azeret"
            )}
          >
            {record.content}
          </span>
          <button onClick={handleDelete}>
            <Image
              src={
                theme === "dark"
                  ? "/delete/trash-white.svg"
                  : "/delete/trash-black.svg"
              }
              height={16}
              width={16}
              alt="delete"
            />
          </button>
        </div>
      )}
      {evmVerify.record && evmVerify.content && (
        <ModalWrapper
          visible={evmVerify.visible}
          setVisible={() => setEvmVerify({ visible: false })}
        >
          <VerifyEvmRecordsV2
            domain={domain}
            record={evmVerify.record}
            close={() => setEvmVerify({ visible: false })}
            recordContent={evmVerify.content}
          />
        </ModalWrapper>
      )}
    </div>
  );
};
