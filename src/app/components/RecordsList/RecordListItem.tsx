import Image from "next/image";
import { ButtonModal } from "../ButtonModal";
import { useState } from "react";
import EditRecordModal from "../Modals/EditRecordModal";
import { useIsTokenized } from "@/hooks/useIsTokenized";
import UnwrapModal from "../Modals/UnwrapModal";

export const RecordListItem = ({
  record,
  domain,
}: {
  record: { record: string; content?: string | undefined };
  domain: string;
}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const { data: isNft } = useIsTokenized(domain);
  return (
    <div className="w-full flex flex-col bg-white/[7%] border-t-[1px] border-white/[24%] rounded-3xl ">
      <div className="flex justify-between w-full pt-2 pb-2 pl-5 pr-2">
        <div className="space-x-2 flex justify-center items-center">
          <span className="text-white text-lg">{record.record}</span>
        </div>
        <div className="flex gap-2 justify-center items-center">
          <ButtonModal
            buttonClass="text-white text-sm w-[50px] px-1 py-3 bg-gradient-to-b from-glass-bg to-edit-button-bg rounded-[16px] flex items-center justify-center border-t border-t-[#FFFFFF33] active:border-t-0"
            buttonText={
              <Image
                src="/pen/pen.svg"
                alt="edit records"
                width={24}
                height={24}
              />
            }
            modalClass="bg-[#03001A] w-full sm:min-w-[520px] h-fit overflow-y-visible border border-[#FFFFFF3D]"
            visible={isModalVisible}
            setVisible={setModalVisible}
          >
            {isNft ? (
              <UnwrapModal
                domain={domain}
                close={() => setModalVisible(false)}
              />
            ) : (
              <EditRecordModal
                recordName={record.record}
                domain={domain}
                close={() => setModalVisible(false)}
              />
            )}
          </ButtonModal>
        </div>
      </div>
      {record.content && (
        <div className="w-full border-t-white/25 border-t h-[39px] pt-2 py-[14px] pl-5">
          <span className="text-base text-[#F8EFF9]/50 font-azeret">
            {record.content}
          </span>
        </div>
      )}
    </div>
  );
};
