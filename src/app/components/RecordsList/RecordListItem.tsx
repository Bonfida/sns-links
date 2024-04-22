import { Record } from "@bonfida/sns-records";
import Image from "next/image";
import { ButtonModal } from "../ButtonModal";
import { useState } from "react";
import EditRecordModal from "../Modals/EditRecordModal";

export const RecordListItem = ({
  record,
  domain,
}: {
  record: { record: string; content?: string | undefined };
  domain: string;
}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  return (
    <div className="w-full flex flex-col bg-white/[7%] border-t-[1px] border-white/[24%] rounded-[24px] ">
      <div className="flex justify-between w-full py-2 px-4">
        <div className="space-x-2 flex justify-center items-center">
          <span className="text-white text-lg">{record.record}</span>
        </div>
        <div className="flex gap-2 justify-center items-center">
          <ButtonModal
            closeIconClass="right-5 top-[20px] w-[240px] h-[240px] sm:w-[48px] sm:h-[48px] rounded-[8px] sm:rounded-[16px] z-200 "
            buttonClass="text-white text-sm w-[50px] px-1 py-3 bg-[#03021A] rounded-[16px] flex items-center justify-center border-t border-t-[#FFFFFF33] active:border-t-0"
            buttonText={
              <Image src="/pen.svg" alt="edit records" width={24} height={24} />
            }
            modalClass="bg-[#03001A] w-full sm:min-w-[520px] h-fit overflow-y-visible"
            visible={isModalVisible}
            setVisible={setModalVisible}
          >
            <EditRecordModal
              recordName={record.record}
              domain={domain}
              close={() => setModalVisible(false)}
            />
          </ButtonModal>
        </div>
      </div>
      {record.content && (
        <div className="w-full border-t-white/25 border-t h-[39px] px-4 py-2">
          <span className="text-base text-[#F8EFF9]/50 font-azeret">
            {record.content}
          </span>
        </div>
      )}
    </div>
  );
};
