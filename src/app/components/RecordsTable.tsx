import { useState, useContext } from "react";
import EditRecordModal from "./EditRecordModal";
import DomainDropdown from "./DomainDropdown";
import { useFetchRecords } from "@/hooks/useFetchRecords";
import SelectedDomainContext from "@/context/selectedDomain";
import { useConnection } from "@solana/wallet-adapter-react";
import ProfilePic from "./ProfilePic";
import LinkShareButton from "./LinkShareButton";

const RecordsTable = () => {
  const { connection } = useConnection();
  const [isEditingRecord, setIsEditingRecord] = useState(false);
  const [editingRecordName, setEditingRecordName] = useState(null);

  const { selectedDomain } = useContext(SelectedDomainContext);

  const { data: recordsData, isLoading: recordsLoading } = useFetchRecords(
    connection,
    selectedDomain
  );

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
      <div className="flex flex-col items-center border-[1px] bg-[#191C30] bg-opacity-90 border-white border-opacity-20 rounded-xl space-y-2 p-10 w-1/3">
        {selectedDomain ? (
          <div className="flex justify-center items-center space-x-2 ">
            <ProfilePic />
            <h1 className="text-5xl text-white font-bold">
              {selectedDomain}.sol
            </h1>
          </div>
        ) : null}
        <div className="justify-between flex-grow items-end w-full flex space-x-3 border rounded-lg border-white border-opacity-20 p-5">
          <DomainDropdown />
          {selectedDomain && <LinkShareButton />}
        </div>

        <table className="w-full table-fixed text-white mt-4">
          <thead className="">
            <tr>
              <th className="p-4 w-1/4 text-start rounded-tl-xl text-sm md:text-base">
                Record
              </th>
              <th className="py-2 text-center text-sm md:text-base">Value</th>
              <th className="p-4 w-1/4 text-center rounded-tr-xl"></th>
            </tr>
          </thead>
          <tbody>
            {!recordsLoading &&
              Object.entries(recordsData.records).map(
                ([recordName, recordValue]) => (
                  <tr key={recordName} className="justify-center items-center">
                    <td className="justify-center border-b-[1px] border-white border-opacity-20 items-center p-4 text-xs md:text-base text-start">
                      {recordName.charAt(0).toUpperCase() + recordName.slice(1)}
                    </td>
                    <td className="justify-center items-center border-b-[1px] border-white border-opacity-20 py-2 text-xs overflow-x-auto no-scrollbar md:text-base text-center">
                      {recordValue}
                    </td>
                    <td className="justify-center items-center border-b-[1px] border-white border-opacity-20 px-4 text-xs md:text-base text-end">
                      <button
                        onClick={() => {
                          handleEdit(recordName);
                        }}
                      >
                        {/* <img src="/edit-icon.svg" alt="Edit" /> */}
                        ...
                      </button>
                    </td>
                  </tr>
                )
              )}
          </tbody>
        </table>
      </div>

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
