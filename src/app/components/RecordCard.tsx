import { useState } from "react";
import EditRecordModal from "./EditRecordModal";

const RecordCard = ({ record }) => {
  const [editingRecord, setEditingRecord] = useState(false);

  const handleEdit = () => {
    if (!editingRecord) {
      setEditingRecord(true);
    } else {
      setEditingRecord(false);
    }
  };
  return (
    <div className="group h-20 w-56 items-center my-3 flex flex-col border border-[#2A2A51] rounded-lg justify-center">
      <div className="w-56 border-b border-[#2A2A51] flex items-center justify-center">
        <h1 className="text-white font-bold text-center">
          {record[0].charAt(0).toUpperCase() + record[0].slice(1)}
        </h1>
        <button
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={handleEdit}
        >
          <img src="/edit-icon.svg" />
        </button>
      </div>
      <div className="h-10 flex justify-center items-end">
        {editingRecord ? (
          <EditRecordModal
            recordToUpdate={record}
            setEditingRecord={setEditingRecord}
          />
        ) : (
          <h1 className="text-white text-center">{record[1]}</h1>
        )}
      </div>
    </div>
  );
};

export default RecordCard;
