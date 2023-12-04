import { useWallet } from "@solana/wallet-adapter-react";
import { abbreviatePubkey } from "@/utils/abbreviate-pubkey/abbreviatePubkey";

const ProfileOverview = () => {
  const { publicKey } = useWallet();
  const abbreviatedPubkey = abbreviatePubkey(publicKey);
  return (
    <div className="flex self-start mb-10">
      <h1 className="text-5xl font-semibold text-white">{abbreviatedPubkey}</h1>
    </div>
  );
};

export default ProfileOverview;
