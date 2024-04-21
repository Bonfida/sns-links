import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
export const GoToProfileButton = () => {
  const router = useRouter();
  const { publicKey } = useWallet();
  const handleNavigation = () => {
    router.push(`/profile/${publicKey}`);
  };

  return (
    <button
      className=" h-12 rounded-2xl px-4 flex items-center justify-center space-x-2 bg-gradient-to-r from-[#00F0FF] to-[#CBFF5E] w-[258px]"
      onClick={() => {
        handleNavigation();
      }}
      type="button"
    >
      <span className="font-bold font-azeret text-base w-fit  normal-case text-[#03021A]">
        View profile
      </span>
    </button>
  );
};
