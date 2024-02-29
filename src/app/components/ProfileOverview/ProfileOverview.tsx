import { abbreviatePubkey } from "@/utils/abbreviate-pubkey/abbreviatePubkey";
import Image from "next/image";
import { PublicKey } from "@solana/web3.js";
import { useFetchRecords } from "@/hooks/useFetchRecords";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useFetchFavoriteDomain } from "@/hooks/useFetchFavoriteDomain";

const ProfileOverview = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const abbreviatedPubkey = abbreviatePubkey(publicKey, 5);
  const { data: favoriteDomain, isLoading: favoriteLoading } =
    useFetchFavoriteDomain(connection, publicKey!);

  const { data: recordsData, isLoading: recordsLoading } = useFetchRecords(
    connection,
    favoriteDomain || undefined
  );

  if (!favoriteLoading) {
    console.log("favoriteDomain", favoriteDomain);
  }

  return (
    <div className="flex justify-start self-start items-center space-x-5">
      {favoriteDomain ? (
        <>
          <Image
            src={recordsData?.pic! || "/default-profile.svg"}
            width={100}
            height={100}
            alt="default pic"
            className="rounded-full"
          />

          <div className="flex flex-col">
            <h1 className="md:text-5xl text-3xl font-semibold text-white">
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
