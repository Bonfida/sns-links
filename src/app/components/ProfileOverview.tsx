import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { abbreviatePubkey } from "@/utils/abbreviate-pubkey/abbreviatePubkey";
import Image from "next/image";
import { useFetchFavoriteDomain } from "@/hooks/useFetchFavoriteDomain";

const ProfileOverview = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const abbreviatedPubkey = abbreviatePubkey(publicKey);
  const { data: favoriteDomain, isLoading: favoriteLoading } =
    useFetchFavoriteDomain(connection, publicKey!);

  return (
    <div className="flex self-start justify-start items-center space-x-5 ">
      <Image
        src="/default-profile.svg"
        width={80}
        height={80}
        alt="default pic"
      />
      {!favoriteLoading && favoriteDomain ? (
        <div className="flex flex-col">
          <h1 className="text-5xl font-semibold text-white">
            {favoriteDomain}.sol
          </h1>
          <h2 className="text-2xl text-slate-400">{abbreviatedPubkey}</h2>
        </div>
      ) : (
        <h1 className="text-5xl font-semibold text-white">
          {abbreviatedPubkey}
        </h1>
      )}
    </div>
  );
};

export default ProfileOverview;
