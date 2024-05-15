import Image from "next/image";
import { ButtonModal } from "../ButtonModal";
import { memo, useState } from "react";
import EditRecordModal from "../Modals/EditRecordModal";
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
import { useFetchVerifyROA } from "@/hooks/useVerifyROA";
import { useWallet } from "@solana/wallet-adapter-react";
import Badge from "../Tooltip/Tooltip";
import { Result } from "@/hooks/useRecordsV2";
import { getRecordValue } from "@/utils/get-record-value";

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

export const RecordListItem = memo(function RecordListItem({
  record,
  domain,
  isOwner,
  isToken,
}: {
  record: Result;
  domain: string;
  isOwner: boolean;
  isToken: boolean;
}) {
  // Wallet
  const { publicKey } = useWallet();

  // Record data
  const {
    record: recordName,
    canBeVerifiedBy,
    isSignInvalid,
    isSigned,
    isVerified,
  } = record;
  const recordContent = getRecordValue(record);

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
  const refreshIsToken = queryClient.invalidateQueries(["isTokenized", domain]);

  //Handlers
  const deleteRecord = useUpdateRecord();
  const handleDelete = async () => {
    try {
      await deleteRecord({
        domain,
        recordName: recordName,
        recordValue: "",
        currentValue: recordContent,
      });
    } catch (err) {
      console.log("Error: ", err);
    } finally {
      await queryClient.invalidateQueries(["records", domain]);
    }
  };

  const updateROA = useUpdateROA();
  const handleRoa = async () => {
    if (EVM_RECORDS.includes(recordName)) {
      return setEvmVerify((prev) => ({
        visible: true,
        content: recordContent,
        record: recordName,
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
          {verifiableRecords.includes(record.record) && isVerified && (
            <Badge
              tooltipContent={`Ownership is verified`}
              imgSrc="/verifications/verified-badge.svg"
              sizeClass="w-[20px]"
            />
          )}
        </div>
        <div className="flex gap-2 justify-center items-center">
          {recordContent &&
            verifiableRecords.includes(record.record) &&
            canBeVerifiedBy !== undefined &&
            canBeVerifiedBy &&
            publicKey?.equals(canBeVerifiedBy) && (
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
          {isOwner && (
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
                  currentValue={recordContent}
                  close={() => setModalVisible(false)}
                />
              )}
            </ButtonModal>
          )}
        </div>
      </div>
      {recordContent && (
        <div className="w-full border-t-white/25 border-t h-[39px] pt-2 py-[14px] pl-5 pr-[26px] flex justify-between overflow-x-auto">
          <span
            className={twMerge(
              theme === "dark" ? "text-[#F8EFF9]/50" : "text-primary-text/90",
              "text-base font-azeret"
            )}
          >
            {recordContent}
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
});
