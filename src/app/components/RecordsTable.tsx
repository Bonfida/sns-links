import { useState } from "react";
import EditRecordModal from "./EditRecordModal";

const RecordsTable = ({
  recordsData,
}: {
  recordsData: { records: { [key: string]: any } };
}) => {
  const [isEditingRecord, setIsEditingRecord] = useState(false);
  const [editingRecordName, setEditingRecordName] = useState(null);

  const handleEdit = (recordName) => {
    console.log("recordName", recordName);
    if (!isEditingRecord) {
      setIsEditingRecord(true);
      setEditingRecordName(recordName);
    } else {
      setIsEditingRecord(false);
    }
  };

  return (
    <>
      <table className="w-full table-fixed text-white">
        <thead className="bg-[#191C30]">
          <tr>
            <th className=" p-4 w-1/4 text-start rounded-tl-xl text-sm md:text-base">
              Record
            </th>
            <th className=" py-2 text-center text-sm md:text-base">Value</th>
            <th className=" p-4 w-1/4 text-center rounded-tr-xl"></th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(recordsData.records).map(
            ([recordName, recordValue]) => (
              <tr key={recordName} className=" justify-center items-center">
                <td className="justify-center border-b-[1px] border-white border-opacity-20 items-center p-4 text-xs md:text-base text-start">
                  {recordName.charAt(0).toUpperCase() + recordName.slice(1)}
                </td>
                <td className="justify-center items-center border-b-[1px] border-white border-opacity-20 py-2 text-xs overflow-x-auto no-scrollbar md:text-base text-center">
                  {recordValue}
                </td>
                <td className="justify-center items-center border-b-[1px] border-white border-opacity-20 px-4 text-xs md:text-base text-end">
                  <button
                    className=""
                    onClick={() => {
                      handleEdit(recordName);
                    }}
                  >
                    <img src="/edit-icon.svg" />
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
      {isEditingRecord && (
        <EditRecordModal
          recordName={editingRecordName}
          setIsEditingRecord={setIsEditingRecord}
        />
      )}
    </>
  );
};

export default RecordsTable;
