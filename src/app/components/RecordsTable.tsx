import { useState } from "react";
import { useFetchRecords } from "@/hooks/useFetchRecords";

const RecordsTable = ({ connection, domain }) => {
  const { data, isLoading } = useFetchRecords(connection, domain);
  const [editingRecord, setEditingRecord] = useState(false);

  const handleEdit = () => {
    setEditingRecord(true);
  };

  if (!isLoading) {
    return (
      <div className=" w-1/2 flex flex-col justify-center items-center ">
        {/* <div className="w-full md:w-1/3 h-2/3 flex flex-col justify-center items-start border-[#2A2A51] rounded-lg border-2 border-r-0"> */}
        {Object.entries(data.records).map((record) => {
          return (
            <div
              key={record[0]}
              className="group h-full w-1/2 items-center my-3 space-x-2 flex flex-col border border-[#2A2A51] rounded-lg p-2 "
            >
              <h1 className="text-white font-bold">
                {record[0].charAt(0).toUpperCase() + record[0].slice(1)}
              </h1>
              <h1 className="text-white">{record[1]}</h1>
              <button
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                onClick={handleEdit}
              >
                <img src="/edit-icon.svg" />
              </button>
            </div>
          );
        })}
      </div>
    );
  }
};

export default RecordsTable;
