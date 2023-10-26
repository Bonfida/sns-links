import { useState } from "react";
import { useFetchRecords } from "@/hooks/useFetchRecords";

const RecordCard = ({ record }) => {
  const [editingRecord, setEditingRecord] = useState(false);
  const [updatedRecordVal, setUpdatedRecordVal] = useState(null);
  const [editingKey, setEditingKey] = useState(null);

  const handleEdit = (key) => {
    setEditingKey(key);
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
          <input
            onChange={(e) => {
              setUpdatedRecordVal(e.target.value);
            }}
            className="text-white border-[#2A2A51] rounded p-1 text-center"
          />
        ) : (
          <h1 className="text-white text-center">{record[1]}</h1>
        )}
      </div>
    </div>
  );
};

export default RecordCard;
