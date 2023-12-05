import React, { useState } from "react";
import { useFetchRecords } from "@/hooks/useFetchRecords";
import { useConnection } from "@solana/wallet-adapter-react";

const Bio = ({ domain }: { domain: string }) => {
  const { connection } = useConnection();
  const { data: recordsData, isLoading: recordsLoading } = useFetchRecords(
    connection,
    domain
  );
  const [isEditable, setIsEditable] = useState(false);
  const [bioText, setBioText] = useState(recordsData?.bio || "Add a bio...");

  const toggleEdit = () => {
    setIsEditable(!isEditable);
  };

  function handleSubmit(event) {
    event.preventDefault();
    // Add your submission logic here
    // If in edit mode, toggle off the edit mode after submission
    if (isEditable) {
      toggleEdit();
    }
  }

  return (
    <form method="post" onSubmit={handleSubmit} className="flex flex-col mt-8">
      <textarea
        name="postContent"
        value={bioText}
        onChange={(e) => setBioText(e.target.value)}
        rows={4}
        cols={45}
        className="text-white rounded-xl bg-inherit"
        readOnly={!isEditable}
      />
      <div className="flex justify-end mt-2">
        <button className="flex self-center" type="button" onClick={toggleEdit}>
          {isEditable ? "Save" : "Edit"}
        </button>
      </div>
    </form>
  );
};

export default Bio;
