import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { abbreviatePubkey } from "@/utils/abbreviatePubkey";

const ProfileOverview = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const abbreviatedPubkey = abbreviatePubkey(publicKey);
  return (
    <div className="flex self-start mb-10">
      <h1 className="text-5xl font-semibold text-white">{abbreviatedPubkey}</h1>
    </div>
  );
};

export default ProfileOverview;
