import { useState, useContext, useEffect } from "react";
import EditRecordModal from "../Modals/EditRecordModal";
import SelectedDomainContext from "@/context/selectedDomain";
import { useConnection } from "@solana/wallet-adapter-react";
import ProfilePic from "../ProfilePic/ProfilePic";
import LinkShareButton from "../Buttons/LinkShareButton";
import { Record } from "@bonfida/spl-name-service";
import { useFetchOwner } from "@/hooks/useFetchOwner";
import { useWallet } from "@solana/wallet-adapter-react";
import { isTokenized } from "../../../utils/tokenizer/isTokenized";
import UnwrapModal from "../Modals/UnwrapModal";
import { checkIsOwner } from "@/utils/owner/checkIsOwner";
import Bio from "../Bio/Bio";
import { RecordsData } from "../../types/RecordsData";
import EditRecordPopover from "../Popovers/EditRecordPopover";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useFetchRecords } from "@/hooks/useFetchRecords";
import { RecordListItem } from "./RecordListItem";
import { SpinnerFida } from "@bonfida/components";

const contactRecords = [Record.Email, Record.Telegram];

const walletRecords = [
  Record.ARWV,
  Record.SOL,
  Record.ETH,
  Record.BTC,
  Record.LTC,
  Record.DOGE,
  Record.SHDW,
  Record.POINT,
  Record.Injective,
  Record.BSC,
];

const socialRecords = [
  Record.Url,
  Record.Discord,
  Record.Github,
  Record.Reddit,
  Record.Twitter,
  Record.Backpack,
];

const RecordsTable = ({ domain }: { domain: string }) => {
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

  const router = useRouter();

  const { data: owner, isLoading: ownerLoading } = useFetchOwner(
    connection,
    selectedDomain || domain
  );

  const { data: recordData, isLoading: recordsLoading } = useFetchRecords(
    connection,
    domain
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

  const navigateBack = () => {
    router.push(`/profile/${publicKey}`);
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
    <div className="w-full overflow-auto">
      <div className=" flex flex-col items-center ">
        <div className=" md:w-[600px] sm:w-[550px] w-[350px] flex justify-start">
          <button onClick={navigateBack} className="flex gap-2">
            <Image src="/back.svg" width={18} height={15} alt="back" />
            <span className="font-azeret text-base font-bold text-white">
              Back
            </span>
          </button>
        </div>

        <div className="space-y-2 mt-10 md:w-[600px] sm:w-[550px] w-[350px] ">
          <div className="flex flex-col justify-around">
            <div className="flex items-center justify-start w-full">
              <ProfilePic domain={domain} />
              <h1 className="md:text-5xl text-3xl font-bold text-white ml-5 mr-1">
                {currentDomain}.sol
              </h1>
              <div className="self-center mt-5">
                {isOwner && <LinkShareButton domain={currentDomain} />}
              </div>
            </div>
            <Bio domain={currentDomain} />
            <div className="flex justify-center items-center flex-col">
              <div className="flex flex-col gap-3 w-full justify- items-center">
                <span>contact</span>
                {!recordsLoading &&
                  recordData
                    ?.filter((record) =>
                      contactRecords.includes(record.record as Record)
                    )
                    .map((record) => (
                      <RecordListItem
                        key={record.record}
                        record={record}
                        domain={currentDomain}
                      />
                    ))}
                <span>socials</span>
                {!recordsLoading &&
                  recordData
                    ?.filter((record) =>
                      socialRecords.includes(record.record as Record)
                    )
                    .map((record) => (
                      <RecordListItem
                        key={record.record}
                        record={record}
                        domain={currentDomain}
                      />
                    ))}
                <span>wallets</span>
                {!recordsLoading &&
                  recordData
                    ?.filter((record) =>
                      walletRecords.includes(record.record as Record)
                    )
                    .map((record) => (
                      <RecordListItem
                        key={record.record}
                        record={record}
                        domain={currentDomain}
                      />
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordsTable;
