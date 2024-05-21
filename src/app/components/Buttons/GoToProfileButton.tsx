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
      style={{ backgroundImage: "var(--action-button-bg)" }}
      className=" h-12 rounded-2xl px-4 flex items-center justify-center space-x-2 w-[258px]"
      onClick={() => {
        handleNavigation();
      }}
      type="button"
    >
      <span className="font-bold font-azeret text-base w-fit  normal-case text-action-button-text">
        View profile
      </span>
    </button>
  );
};
