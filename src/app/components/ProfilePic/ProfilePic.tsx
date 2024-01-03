import { useContext, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import SelectedDomainContext from "@/context/selectedDomain";
import { useFetchRecords } from "@/hooks/useFetchRecords";
import EditRecordModal from "../Modals/EditRecordModal";
import { Record } from "@bonfida/spl-name-service";
import Image from "next/image";
import { useFetchOwner } from "@/hooks/useFetchOwner";
import { checkIsOwner } from "@/utils/owner/checkIsOwner";

const ProfilePic = ({
  domain,
  customHeight,
  customWidth,
  hideEdit,
}: {
  domain?: string | undefined;
  customHeight?: number;
  customWidth?: number;
  hideEdit?: Boolean;
}) => {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [editingRecord, setIsEditingRecord] = useState(false);
  const [isEditingPic, setIsEditingPic] = useState(false);

  const { data: recordsData, isLoading: recordsLoading } = useFetchRecords(
    connection,
    domain!
  );

  const { data: owner, isLoading: ownerLoading } = useFetchOwner(
    connection,
    domain!
  );

  const handlePicEdit = () => {
    setIsEditingPic(true);
  };

  return (
    <div className="relative overflow-hidden rounded-full">
      <Image
        width={customWidth || 100}
        height={customHeight || 100}
        src={recordsData?.pic || "/default-profile.svg"}
        className="object-fit rounded-full"
        alt="Profile"
      />
      {connected && checkIsOwner(owner, publicKey) && hideEdit !== true && (
        <div className="absolute bottom-0 left-0 flex items-center justify-center w-full bg-gray-700 bg-opacity-50 h-1/6">
          <button
            onClick={() => {
              handlePicEdit();
            }}
            aria-label="Edit Profile Picture"
          >
            <Image
              width={10}
              height={10}
              className="text-white"
              alt="pic edit icon"
              src="/camera.svg"
            />
          </button>
        </div>
      )}

      {isEditingPic && (
        <EditRecordModal
          recordName={Record.Pic}
          setIsEditingRecord={setIsEditingRecord}
          setIsEditingPic={setIsEditingPic}
          domain={domain!}
        />
      )}
    </div>
  );
};

export default ProfilePic;
