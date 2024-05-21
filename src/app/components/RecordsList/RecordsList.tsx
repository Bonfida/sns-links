import { useContext } from "react";
import SelectedDomainContext from "@/context/selectedDomain";
import { useConnection } from "@solana/wallet-adapter-react";
import ProfilePic from "../ProfilePic/ProfilePic";
import { Record } from "@bonfida/spl-name-service";
import { useFetchOwner } from "@/hooks/useFetchOwner";
import { useWallet } from "@solana/wallet-adapter-react";
import Bio from "../Bio/Bio";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { RecordListItem } from "./RecordListItem";
import { SpinnerFida } from "@bonfida/components";
import { useTheme } from "next-themes";
import { useRecordsV2 } from "@/hooks/useRecordsV2";
import { useIsTokenized } from "@/hooks/useIsTokenized";

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
  const { publicKey } = useWallet();
  const { selectedDomain } = useContext(SelectedDomainContext);
  const currentDomain = selectedDomain || domain;

  const router = useRouter();

  const { data: owner, isLoading: ownerLoading } = useFetchOwner(
    connection,
    selectedDomain || domain
  );

  const isOwner = owner === publicKey?.toBase58();
  const { theme } = useTheme();
  const { data: recordData, loading: recordsLoading } = useRecordsV2(domain);
  const { data: isToken } = useIsTokenized(domain);

  const loading = recordsLoading || ownerLoading;

  const navigateBack = () => {
    router.push(`/profile/${publicKey}`);
  };

  return (
    <div className="w-full py-5 h-full">
      <div className=" flex flex-col items-center ">
        <div className="md:w-[600px] sm:w-[550px] w-[350px] flex justify-start">
          <button onClick={navigateBack} className="flex gap-2 items-center">
            <Image
              src={
                theme === "dark"
                  ? "/back/back-green.svg"
                  : "/back/back-purple.svg"
              }
              width={18}
              height={15}
              alt="back"
            />
            <span className="font-azeret text-base font-bold text-link">
              Back
            </span>
          </button>
        </div>

        <div className="space-y-2 mt-10 md:w-[600px] sm:w-[550px] w-[350px]">
          <div className="flex flex-col justify-around">
            <div className="flex sm:flex-row flex-col items-center justify-start w-full gap-4">
              <ProfilePic
                domain={domain}
                customSize="h-[56px] w-[56px] sm:h-[120px] sm:w-[120px]"
              />
              <div className="flex gap-2">
                <h1 className="md:text-5xl text-2xl font-bold text-primary-text">
                  {currentDomain}.sol
                </h1>

                <a
                  href={`https://sns-links.vercel.app/user/${domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <Image
                    src={
                      theme === "dark"
                        ? "/link-out/link-out-green.svg"
                        : "/link-out/link-out-purple.svg"
                    }
                    height={30}
                    width={30}
                    alt=""
                    className="w-6 h-6 sm:w-[30px] sm:h-[30px]"
                  />
                </a>
              </div>
            </div>
            <Bio domain={currentDomain} isToken={isToken || false} />
            <div className="flex justify-center items-center flex-col">
              <div className="flex flex-col gap-8 w-full justify- items-center mb-10">
                {loading ? (
                  <SpinnerFida variant={theme === "dark" ? "white" : "color"} />
                ) : (
                  <>
                    <div className="gap-2 w-full flex flex-col justify-center items-center">
                      <span className="text-primary-text pb-4 text-[14px] font-semibold">
                        CONTACT
                      </span>
                      {recordData
                        ?.filter((record) =>
                          contactRecords.includes(record.record)
                        )
                        .map((record) => (
                          <RecordListItem
                            key={record.record}
                            record={record}
                            domain={currentDomain}
                            isOwner={isOwner}
                            isToken={isToken || false}
                          />
                        ))}
                    </div>
                    <div className="gap-2 w-full flex flex-col justify-center items-center">
                      <span className="text-primary-text text-[14px] font-semibold">
                        SOCIALS
                      </span>
                      {!recordsLoading &&
                        recordData
                          ?.filter((record) =>
                            socialRecords.includes(record.record)
                          )
                          .map((record) => (
                            <RecordListItem
                              key={record.record}
                              record={record}
                              domain={currentDomain}
                              isOwner={isOwner}
                              isToken={isToken || false}
                            />
                          ))}
                    </div>
                    <div className="gap-2 w-full flex flex-col justify-center items-center">
                      <span className="text-primary-text text-[14px] font-semibold">
                        WALLETS
                      </span>
                      {!recordsLoading &&
                        recordData
                          ?.filter((record) =>
                            walletRecords.includes(record.record)
                          )
                          .map((record) => (
                            <RecordListItem
                              key={record.record}
                              record={record}
                              domain={currentDomain}
                              isOwner={isOwner}
                              isToken={isToken || false}
                            />
                          ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordsTable;
