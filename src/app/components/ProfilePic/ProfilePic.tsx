import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Record } from "@bonfida/spl-name-service";
import Image from "next/image";
import { useFetchOwner } from "@/hooks/useFetchOwner";
import { checkIsOwner } from "@/utils/owner";
import { ButtonModal } from "../ButtonModal";
import { EditPicModal } from "../Modals/EditPicModal";
import { GenericLoading } from "@bonfida/components";
import { twMerge } from "tailwind-merge";
import { useTheme } from "next-themes";
import { useRecordsV2 } from "@/hooks/useRecordsV2";
import { getRecordValue } from "@/utils/get-record-value";

const ProfilePic = ({
  domain,
  customSize,
  hideEdit,
}: {
  domain: string;
  customSize?: string;
  hideEdit?: Boolean;
}) => {
  const { connection } = useConnection();
  const { theme } = useTheme();
  const { publicKey, connected } = useWallet();
  const [isModalVisible, setModalVisible] = useState(false);

  const { data: recordsData, isLoading: recordsLoading } = useRecordsV2(domain);

  const { data: owner } = useFetchOwner(connection, domain!);

  const picRecord = recordsData?.find((record) => {
    return record.record === Record.Pic;
  });

  let picContent = picRecord ? getRecordValue(picRecord) : undefined;

  return (
    <div className="relative overflow-hidden rounded-full">
      <Image
        width={120}
        height={120}
        src={picContent || "/user/default-profile.svg"}
        className={twMerge(
          "object-fit rounded-full",
          customSize ? customSize : "sm:h-[120px] sm:w-[120px]"
        )}
        alt="Profile"
      />
      {recordsLoading && (
        <GenericLoading
          className={twMerge(
            "absolute bottom-0 left-0 w-full h-1/6",
            theme === "light" ? "bg-list-item-bg" : ""
          )}
        />
      )}
      {connected && checkIsOwner(owner, publicKey) && hideEdit !== true && (
        <div className="absolute bottom-0 left-0 flex items-center justify-center w-full bg-gray-700 bg-opacity-50 h-1/6">
          <ButtonModal
            buttonText={
              <Image
                width={10}
                height={10}
                className="text-white"
                alt="pic edit icon"
                src="/camera/camera.svg"
              />
            }
            visible={isModalVisible}
            setVisible={setModalVisible}
            modalClass=""
          >
            <EditPicModal
              currentValue={picContent}
              domain={domain}
              close={() => setModalVisible(false)}
            />
          </ButtonModal>
        </div>
      )}
    </div>
  );
};

export default ProfilePic;
