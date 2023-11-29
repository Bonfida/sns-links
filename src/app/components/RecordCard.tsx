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
    <div className="group h-[352px] w-[352px] items-center my-3 flex flex-col border border-[#2A2A51] rounded-xl justify-center bg-[url('/domains/regular.svg')]">
      <div className="flex items-center justify-center h-1/2">
        <h1 className="font-bold text-center text-[#2A2A51] text-2xl">
          {domain}.sol
        </h1>
      </div>
      <button className="px-3 py-4 bg-[#2A2A51] rounded-xl text-white font-semibold">
        View Links
      </button>
    </div>
  );
};

export default DomainCard;
