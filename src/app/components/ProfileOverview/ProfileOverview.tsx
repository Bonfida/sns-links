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
    <div className="flex justify-start items-center space-x-5 w-[600px]">
      {favoriteDomain ? (
        <>
          <Image
            src={picRecord?.content || "/default-profile.svg"}
            width={120}
            height={120}
            alt="default pic"
            className="rounded-full"
          />

          <div className="flex flex-col">
            <h1 className="md:text-4xl text-3xl font-semibold text-white">
              {favoriteDomain}.sol
            </h1>
            <h2 className="md:text-2xl text-xl text-slate-400">
              {abbreviatedPubkey}
            </h2>
          </div>
        </>
      ) : (
        <>
          <Image
            src="/default-profile.svg"
            width={100}
            height={100}
            alt="default pic"
            className="rounded-full"
          />
          <h1 className="md:text-5xl text-3xl font-semibold text-white">
            {abbreviatedPubkey}
          </h1>
        </>
      )}
    </div>
  );
};

export default ProfileOverview;
