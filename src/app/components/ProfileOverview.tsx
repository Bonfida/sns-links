import { useWallet } from "@solana/wallet-adapter-react";
import { abbreviatePubkey } from "@/utils/abbreviate-pubkey/abbreviatePubkey";
import Image from "next/image";

const ProfileOverview = () => {
  const { publicKey } = useWallet();
  const abbreviatedPubkey = abbreviatePubkey(publicKey);
  return (
    <div className="flex self-start mb-10 justify-start items-center space-x-5 ">
      <Image
        src="/default-profile.svg"
        width={80}
        height={80}
        alt="default pic"
      />
      <h1 className="text-5xl font-semibold text-white">{abbreviatedPubkey}</h1>
    </div>
  );
};

export default ProfileOverview;
