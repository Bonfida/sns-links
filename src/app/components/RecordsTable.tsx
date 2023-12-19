import { useState, useContext, useEffect } from "react";
import EditRecordModal from "./EditRecordModal";
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
import Bio from "../components/Bio";
import { RecordsData } from "../types/RecordsData";
import EditRecordPopover from "./EditRecordPopover";

const RecordsTable = ({
  domain,
  recordsData,
  recordsLoading,
}: {
  domain: string;
  recordsData: RecordsData | undefined;
  recordsLoading: boolean;
}) => {
  const { connection } = useConnection();
  const [isEditingRecord, setIsEditingRecord] = useState<boolean>(false);
  const [isEditingPic, setIsEditingPic] = useState(false);
  const [editingRecordName, setEditingRecordName] = useState<Record>(
    "" as Record
  );
  const [isOwner, setIsOwner] = useState(false);
  const { publicKey, connected, signMessage, signTransaction } = useWallet();
  const { selectedDomain } = useContext(SelectedDomainContext);
  const currentDomain = selectedDomain || domain;
  const [isToken, setIsToken] = useState(false);

  const { data: owner, isLoading: ownerLoading } = useFetchOwner(
    connection,
    selectedDomain || domain
  );

  const handleEdit = async (recordName: Record) => {
    const isToken = await isTokenized(currentDomain!, connection, publicKey!);

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
      <div className="md:w-[200px] md:h-[200px] w-[0px] h-[0px] rounded-full bg-gradient-to-r -top-[50px] -right-[100px] absolute from-indigo-500 blur-lg z-0" />
      <div className="md:w-[200px] md:h-[200px] w-[0px] h-[0px] rounded-full bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% -bottom-[50px] -left-[100px] z-0 absolute  blur-lg" />
      <div className="border-[1px] bg-white/10 backdrop-blur-sm border-white/20 rounded-xl space-y-2 p-10 mt-10 md:w-[800px] sm:w-[550px] w-[350px]">
        {selectedDomain || domain ? (
          <>
            <div className="flex flex-col items-center justify-around">
              <div className="flex items-center justify-center w-full">
                <ProfilePic domain={domain} />
                <h1 className="md:text-5xl text-3xl font-bold text-white ml-5 mr-1">
                  {selectedDomain || domain}.sol
                </h1>
                {/* WIP on new button placement */}
                <div className="self-center mt-5">
                  {isOwner && <LinkShareButton domain={domain} />}
                </div>
              </div>
              <Bio domain={selectedDomain || domain} />
            </div>
          </>
        ) : null}
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
                        {recordValue as string}
                      </td>
                      <td className="justify-center items-center border-b-[1px] border-white border-opacity-20 px-4 text-xs md:text-base text-end">
                        {isOwner && !ownerLoading && (
                          <EditRecordPopover
                            setIsEditingRecord={setIsEditingRecord}
                            isEditingRecord={isEditingRecord}
                            setIsToken={setIsToken}
                            setEditingRecordName={setEditingRecordName}
                            recordName={recordName}
                            domain={domain}
                            connection={connection}
                            publicKey={publicKey!}
                            signMessage={signMessage!}
                            signTransaction={signTransaction!}
                          />
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
            domain={domain}
          />
        ))}
    </div>
  );
};

export default RecordsTable;
