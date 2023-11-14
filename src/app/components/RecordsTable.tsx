import { useState } from "react";
import EditRecordModal from "./EditRecordModal";

const RecordsTable = ({
  recordsData,
}: {
  recordsData: { records: { [key: string]: any } };
}) => {
  const [editingRecord, setEditingRecord] = useState(false);

  const handleEdit = () => {
    if (!editingRecord) {
      setEditingRecord(true);
    } else {
      setEditingRecord(false);
    }
  };

  return (
    <table className="w-full table-fixed text-white">
      <thead className="bg-[#191C30]">
        <tr>
          <th className=" p-4 w-1/4 text-start rounded-tl-xl">Record</th>
          <th className=" py-2 text-center">Value</th>
          <th className=" p-4 w-1/4 text-center rounded-tr-xl"></th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(recordsData.records).map(
          ([recordName, recordValue]) => (
            <tr key={recordName} className=" justify-center items-center">
              <td className="justify-center border-b-[1px] border-white border-opacity-20 items-center p-4  text-start">
                {recordName.charAt(0).toUpperCase() + recordName.slice(1)}
              </td>
              <td className="justify-center items-center border-b-[1px] border-white border-opacity-20 py-2 text-center">
                {recordValue}
              </td>
              <td className="justify-center items-center border-b-[1px] border-white border-opacity-20 px-4 text-end">
                <button className="" onClick={handleEdit}>
                  <img src="/edit-icon.svg" />
                </button>
              </td>
            </tr>
          )
        )}
      </tbody>
    </table>
  );
};

export default RecordsTable;
