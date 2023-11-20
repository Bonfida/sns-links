import { useContext, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import SelectedDomainContext from "@/context/selectedDomain";
import { useFetchRecords } from "@/hooks/useFetchRecords";
import EditRecordModal from "./EditRecordModal";
import { Record } from "@bonfida/spl-name-service";

const ProfilePic = () => {
  const { connection } = useConnection();
  const { selectedDomain } = useContext(SelectedDomainContext);
  const [isEditingPic, setIsEditingPic] = useState(false);
  const { data: recordsData, isLoading: recordsLoading } = useFetchRecords(
    connection,
    selectedDomain
  );

  const handlePicEdit = () => {
    setIsEditingPic(true);
  };

  return (
    <div className="relative w-14 rounded-full overflow-hidden">
      <img
        src={recordsData?.pic}
        className="w-full h-full object-cover"
        alt="Profile"
      />
      <div className="absolute bottom-0 left-0 w-full h-1/6 flex items-center justify-center bg-gray-700 bg-opacity-50">
        <button
          onClick={() => {
            handlePicEdit();
          }}
          aria-label="Edit Profile Picture"
        >
          <img className="text-white" src="./camera.svg" />
        </button>
      </div>
      {isEditingPic && (
        <EditRecordModal
          recordName={Record.Pic}
          setIsEditingPic={setIsEditingPic}
        />
      )}
    </div>
  );
};

export default ProfilePic;
