import { useState } from "react";
import EditRecordModal from "./EditRecordModal";

const DomainCard = ({ domain }: { domain: string }) => {
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
        <h1 className="font-bold text-center text-white">{domain}.sol</h1>
      </div>
    </div>
  );
};

export default DomainCard;
