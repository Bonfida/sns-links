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

  const handleEdit = (recordName: string) => {
    console.log("recordName", recordName);
    if (!isEditingRecord) {
      setIsEditingRecord(true);
      setEditingRecordName(recordName);
    } else {
      setIsEditingRecord(false);
    }
  };

  return (
    <div className="flex flex-col items-center relative">
      <div className="w-[200px] h-[200px] rounded-full bg-gradient-to-r -top-[50px] -right-[100px] absolute from-indigo-500 blur-lg z-0" />
      <div className="w-[200px] h-[200px] rounded-full bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% -bottom-[50px] -left-[100px] z-0 absolute  blur-lg" />
      <div className="border-[1px] bg-white/10 backdrop-blur-sm border-white/20 rounded-xl space-y-2 p-10 md:w-1/2 w-full md:mt-10 mt-28 max-w-[800px]">
        {selectedDomain ? (
          <div className="flex justify-center items-center space-x-2 w-full ">
            <ProfilePic />
            <h1 className="text-5xl text-white font-bold">
              {selectedDomain}.sol
            </h1>
          </div>
        ) : null}
        <div className="justify-between flex-grow items-end w-full flex space-x-3  p-5">
          <div className="w-24 h-24 rounded-full bg-gradient-radial"></div>
          <DomainDropdown />
          {selectedDomain && <LinkShareButton />}
        </div>

        <table className="w-full table-fixed text-white mt-4 z-10">
          <thead className="">
            <tr>
              <th className="p-4 w-1/4 text-start rounded-tl-xl text-sm md:text-base bg-[#191C30] ">
                Record
              </th>
              <th className="py-2 text-center text-sm md:text-base bg-[#191C30] ">
                Value
              </th>
              <th className="p-4 w-1/4 text-center rounded-tr-xl bg-[#191C30] "></th>
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
                    <td className="justify-center items-center border-b-[1px] border-white border-opacity-20 py-2 text-xs overflow-x-auto no-scrollbar md:text-base text-center font-semibold">
                      {recordValue}
                    </td>
                    <td className="justify-center items-center border-b-[1px] border-white border-opacity-20 px-4 text-xs md:text-base text-end">
                      {selectedDomain && (
                        <button
                          onClick={() => {
                            handleEdit(recordName);
                          }}
                        >
                          ...
                        </button>
                      )}
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
    </div>
  );
};

export default RecordsTable;
