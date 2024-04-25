import { abbreviatePubkey } from "@/utils/abbreviate-pubkey/abbreviatePubkey";
import Image from "next/image";
import { useFetchRecords } from "@/hooks/useFetchRecords";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useFavouriteDomain } from "@/hooks/useFetchFavoriteDomain";
import { Record } from "@bonfida/spl-name-service";

const ProfileOverview = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const abbreviatedPubkey = abbreviatePubkey(publicKey, 5);
  const { data: favoriteDomain, loading: favoriteLoading } = useFavouriteDomain(
    publicKey?.toBase58()
  );

  const { data: recordsData, isLoading: recordsLoading } = useFetchRecords(
    connection,
    favoriteDomain || undefined
  );

  const picRecord = recordsData?.find((record) => {
    return record.record === Record.Pic;
  });

  return (
    <div className="flex flex-col sm:flex-row justify-start items-center sm:space-x-5 w-full">
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
            <span className="md:text-4xl text-2xl font-semibold text-profile-overview-text font-azeret">
              {favoriteDomain}.sol
            </span>
            <span className="md:text-2xl text-base text-profile-overview-text font-azeret">
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
          <span className="md:text-2xl text-base text-profile-overview-text font-azeret">
            {abbreviatedPubkey}
          </span>
        </>
      )}
    </div>
  );
};

export default ProfileOverview;
