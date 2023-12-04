import { useState, useContext, useEffect } from "react";
import EditRecordModal from "./EditRecordModal";
import DomainDropdown from "./DomainDropdown";
import { useFetchRecords } from "@/hooks/useFetchRecords";
import SelectedDomainContext from "@/context/selectedDomain";
import { useConnection } from "@solana/wallet-adapter-react";
import ProfilePic from "./ProfilePic";
import LinkShareButton from "./LinkShareButton";
import { Record } from "@bonfida/spl-name-service";
import { useFetchOwner } from "@/hooks/useFetchOwner";
import { useWallet } from "@solana/wallet-adapter-react";
import { isTokenized } from "../../utils/tokenizer/isTokenized";
import UnwrapModal from "./UnwrapModal";
import { checkIsOwner } from "@/utils/owner/checkIsOwner";

const RecordsTable = ({ domain }: { domain: string }) => {
  const { connection } = useConnection();
  const [isEditingRecord, setIsEditingRecord] = useState<boolean>(false);
  const [isEditingPic, setIsEditingPic] = useState(false);
  const [editingRecordName, setEditingRecordName] = useState<Record>(
    "" as Record
  );
  const [isOwner, setIsOwner] = useState(false);
  const { publicKey, connected } = useWallet();
  const { selectedDomain } = useContext(SelectedDomainContext);
  const currentDomain = selectedDomain || domain;
  const [isToken, setIsToken] = useState(false);

  const { data: recordsData, isLoading: recordsLoading } = useFetchRecords(
    connection,
    selectedDomain
  );

  const { data: owner, isLoading: ownerLoading } = useFetchOwner(
    connection,
    selectedDomain || domain
  );

  const handleEdit = async (recordName: Record) => {
    const isToken = await isTokenized(currentDomain!, connection, publicKey!);
    console.log("isToken", isToken);

    if (!isEditingRecord) {
      setIsEditingRecord(true);
      if (isToken) {
        setIsToken(true);
      } else {
        setEditingRecordName(recordName);
      }
    } else {
      setIsEditingRecord(false);
    }
  };

  useEffect(() => {
    if (!connected) {
      setIsOwner(false);
    }
    if (connected && checkIsOwner(owner, publicKey)) {
      setIsOwner(true);
    }
  }, [connected, publicKey, owner]);

  return (
    <div className="relative flex flex-col items-center">
      <div className="w-[200px] h-[200px] rounded-full bg-gradient-to-r -top-[50px] -right-[100px] absolute from-indigo-500 blur-lg z-0" />
      <div className="w-[200px] h-[200px] rounded-full bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% -bottom-[50px] -left-[100px] z-0 absolute  blur-lg" />
      <div className="border-[1px] bg-white/10 backdrop-blur-sm border-white/20 rounded-xl space-y-2 p-10  md:mt-10 mt-28 max-w-[800px]">
        {selectedDomain || domain ? (
          <div className="flex items-center justify-center w-full space-x-2 ">
            <ProfilePic domain={domain} />
            <h1 className="text-5xl font-bold text-white">
              {selectedDomain || domain}.sol
            </h1>
          </div>
        ) : null}
        {isOwner && (
          <div className="flex items-end justify-between flex-grow w-full p-5 space-x-3">
            {/* <div className="w-24 h-24 rounded-full bg-gradient-radial"></div> */}
            <DomainDropdown />
            {selectedDomain && <LinkShareButton />}
          </div>
        )}
        <table className="z-10 w-full mt-4 text-white table-fixed">
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
            {!recordsLoading && recordsData
              ? Object.entries(recordsData.records).map(
                  ([recordName, recordValue]) => (
                    <tr
                      key={recordName}
                      className="items-center justify-center"
                    >
                      <td className="justify-center border-b-[1px] border-white border-opacity-20 items-center p-4 text-xs md:text-base text-start">
                        {recordName.charAt(0).toUpperCase() +
                          recordName.slice(1)}
                      </td>
                      <td className="justify-center items-center border-b-[1px] border-white border-opacity-20 py-2 text-xs overflow-x-auto no-scrollbar md:text-base text-center font-semibold">
                        {recordValue}
                      </td>
                      <td className="justify-center items-center border-b-[1px] border-white border-opacity-20 px-4 text-xs md:text-base text-end">
                        {isOwner && !ownerLoading && (
                          <button
                            onClick={() => {
                              handleEdit(recordName as Record);
                            }}
                          >
                            ...
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                )
              : null}
          </tbody>
        </table>
      </div>

      {isEditingRecord &&
        (isToken ? (
          <UnwrapModal domain={currentDomain!} />
        ) : (
          <EditRecordModal
            recordName={editingRecordName}
            setIsEditingPic={setIsEditingPic}
            setIsEditingRecord={setIsEditingRecord}
          />
        ))}
    </div>
  );
};

export default RecordsTable;
