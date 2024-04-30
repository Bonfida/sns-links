import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useFetchRecords } from "@/hooks/useFetchRecords";
import { Record } from "@bonfida/spl-name-service";
import Image from "next/image";
import { useFetchOwner } from "@/hooks/useFetchOwner";
import { checkIsOwner } from "@/utils/owner/checkIsOwner";
import { ButtonModal } from "../ButtonModal";
import { EditPicModal } from "../Modals/EditPicModal";
import { GenericLoading } from "@bonfida/components";

const ProfilePic = ({
  domain,
  customHeight,
  customWidth,
  hideEdit,
}: {
  domain: string;
  customHeight?: number;
  customWidth?: number;
  hideEdit?: Boolean;
}) => {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [isModalVisible, setModalVisible] = useState(false);

  const { data: recordsData, isLoading: recordsLoading } = useFetchRecords(
    connection,
    domain!
  );

  const { data: owner, isLoading: ownerLoading } = useFetchOwner(
    connection,
    domain!
  );

  const picRecord = recordsData?.find((record) => {
    return record.record === Record.Pic;
  });

  return (
    <div className="relative overflow-hidden rounded-full">
      <Image
        width={customWidth || 100}
        height={customHeight || 100}
        src={picRecord?.content || "/user/default-profile.svg"}
        className="object-fit rounded-full"
        alt="Profile"
      />
      {recordsLoading && (
        <GenericLoading className="absolute bottom-0 left-0 w-full h-1/6" />
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
            modalClass="bg-[#03001A] w-full sm:min-w-[520px] h-fit overflow-y-visible"
          >
            <EditPicModal
              recordName="pic"
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
