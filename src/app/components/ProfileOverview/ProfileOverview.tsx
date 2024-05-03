import { abbreviatePubkey } from "@/utils/abbreviate-pubkey/abbreviatePubkey";
import Image from "next/image";
import { useFetchRecords } from "@/hooks/useFetchRecords";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useFavouriteDomain } from "@/hooks/useFetchFavoriteDomain";
import { Record } from "@bonfida/spl-name-service";
import { useTheme } from "next-themes";

const ProfileOverview = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const abbreviatedPubkey = abbreviatePubkey(publicKey, 5);
  const { data: favoriteDomain, loading: favoriteLoading } = useFavouriteDomain(
    publicKey?.toBase58()
  );
  const { theme } = useTheme();

  const { data: recordsData, isLoading: recordsLoading } = useFetchRecords(
    connection,
    favoriteDomain || undefined
  );

  const picRecord = recordsData?.find((record) => {
    return record.record === Record.Pic;
  });

  return (
    <div className="flex flex-col sm:flex-row justify-start items-center sm:space-x-5 w-full gap-y-5 py-3 sm:py-0">
      {favoriteDomain ? (
        <>
          <Image
            src={picRecord?.content || "/user/default-profile.svg"}
            width={120}
            height={120}
            alt="default pic"
            className="rounded-full sm:w-[120px] sm:h-[120px] w-[56px] h-[56px]"
          />

          <div className="flex flex-col items-center sm:items-start">
            <div className="flex gap-2">
              <span className="md:text-4xl text-2xl font-semibold text-primary-text font-azeret">
                {favoriteDomain}.sol
              </span>
              <a
                href={`http://localhost:3000/user/${favoriteDomain}`}
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

            <span className="md:text-2xl text-base text-primary-text font-azeret">
              {abbreviatedPubkey}
            </span>
          </div>
        </>
      ) : (
        <>
          <Image
            src="/user/default-profile.svg"
            width={100}
            height={100}
            alt="default pic"
            className="rounded-full sm:w-[120px] sm:h-[120px] w-[56px] h-[56px]"
          />
          <span className="md:text-2xl text-base text-primary-text font-azeret">
            {abbreviatedPubkey}
          </span>
        </>
      )}
    </div>
  );
};

export default ProfileOverview;
