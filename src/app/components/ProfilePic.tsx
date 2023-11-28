import { useContext, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import SelectedDomainContext from "@/context/selectedDomain";
import { useFetchRecords } from "@/hooks/useFetchRecords";
import EditRecordModal from "./EditRecordModal";
import { Record } from "@bonfida/spl-name-service";
import Image from "next/image";

const ProfilePic = () => {
  const { connection } = useConnection();
  const { selectedDomain } = useContext(SelectedDomainContext);
  const [editingRecord, setIsEditingRecord] = useState(false);
  const [isEditingPic, setIsEditingPic] = useState(false);
  const { data: recordsData, isLoading: recordsLoading } = useFetchRecords(
    connection,
    selectedDomain
  );

  const handlePicEdit = () => {
    setIsEditingPic(true);
  };

  return (
    <div className="relative w-24 overflow-hidden rounded-full">
      <img
        src={recordsData?.pic}
        className="object-cover w-full h-full"
        alt="Profile"
      />
      <div className="absolute bottom-0 left-0 flex items-center justify-center w-full bg-gray-700 bg-opacity-50 h-1/6">
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
          setIsEditingRecord={setIsEditingRecord}
          setIsEditingPic={setIsEditingPic}
        />
      )}
    </div>
  );
};

export default ProfilePic;
