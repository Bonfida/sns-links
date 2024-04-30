import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { abbreviatePubkey } from "@/utils/abbreviate-pubkey/abbreviatePubkey";
import { useRouter } from "next/navigation";
import ProfilePic from "../ProfilePic/ProfilePic";
import { twMerge } from "tailwind-merge";
import { usePrevious } from "ahooks";
import { Popover } from "@headlessui/react";
import { usePopper } from "react-popper";
import { useState, useEffect, useContext } from "react";
import { PublicKey } from "@solana/web3.js";
import { useModalContext } from "../../../hooks/useModalContext";
import { useDomainsForOwner, useFavoriteDomain } from "@bonfida/sns-react";
import Image from "next/image";
import { BuyADomainButton } from "../Buttons/BuyADomain";
import ThemeContext from "@/context/theme";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle";

export const WalletConnect = ({
  width,
  green,
}: {
  width?: number;
  green?: boolean;
}) => {
  //Connection and Wallet
  const { connected, publicKey, connecting, disconnect } = useWallet();
  const { connection } = useConnection();
  const { theme, setTheme } = useContext(ThemeContext);
  const themeDescription = theme === "dark" ? "Dark mode" : "Light mode";

  // Domain
  const { result: userDomainList, loading: isuserDomainListLoading } =
    useDomainsForOwner(connection, publicKey);

  const { result: favoriteDomain, loading: isFaovriteDomainLoading } =
    useFavoriteDomain(connection, publicKey);

  const favOrFirst = favoriteDomain
    ? favoriteDomain.domain
    : userDomainList?.[0]?.domain;

  const displayedUser = favOrFirst
    ? favOrFirst
    : abbreviatePubkey(publicKey, 4);

  // Router
  const router = useRouter();

  // Visibility
  const { setVisible, visible } = useWalletModal();
  const { setVisible: setVisibleContext, visible: visibleContext } =
    useModalContext();
  const previous = usePrevious(visible);
  let [referenceElement, setReferenceElement] = useState<HTMLButtonElement>();
  let [popperElement, setPopperElement] = useState<HTMLDivElement>();
  let { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "top-start",
  });

  useEffect(() => {
    if (previous && visibleContext) {
      setVisibleContext(false);
    }
  }, [visible, setVisibleContext, visibleContext, previous]);

  if (connected && publicKey) {
    return (
      <Popover>
        <Popover.Button
          // @ts-ignore
          ref={setReferenceElement}
        >
          <div className="bg-gradient-to-b from-glass-bg to-bg-wallet-connect-bg h-12 rounded-[15px] px-4 flex items-center justify-center sm:gap-x-2 border-t border-t-[#FFFFFF33] sm:w-[196px] w-[50px]">
            <div className="sm:inline-block hidden">
              <ProfilePic
                domain={favoriteDomain?.domain || ""}
                hideEdit={true}
                customHeight={24}
                customWidth={24}
              />
            </div>
            <div className="sm:hidden inline-flex items-center justify-center">
              <Image
                width={24}
                height={24}
                alt="wallet"
                src="/wallet/wallet-white.svg"
              />
            </div>
            <span className="font-bold text-white font-azeret w-fit sm:inline-block hidden">
              {displayedUser}.sol
            </span>
          </div>
        </Popover.Button>

        {/* Dropdown */}
        <Popover.Panel
          // @ts-ignore
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
          className="absolute w-full md:w-[253px] z-60"
        >
          <div className="bg-primary-bg rounded-[24px] border border-standard-border md:mt-2 mb-2 md:mb-0 z-60 gap-3  p-4">
            <span className="text-wallet-connect-text text-[14px] font-azeret sm:hidden">
              {favOrFirst}.sol
            </span>
            <div className="flex flex-col font-azeret font-medium text-2xl z-60">
              <div className="py-3 border-b border-b-standard-border h-12 z-60">
                <button
                  onClick={() =>
                    router.push(`/profile/pubkey=${publicKey.toBase58()}`)
                  }
                  type="button"
                  className="w-fit font-semibold text-link"
                >
                  View profile
                </button>
              </div>
              <div className="py-3 border-b border-b-standard-border h-12">
                <button
                  onClick={() => setVisible(true)}
                  type="button"
                  className="w-fit text-link"
                >
                  Change wallet
                </button>
              </div>
              <div className="sm:pt-6 sm:pb- py-3 h-14 sm:border-b-0 border-b border-b-standard-border">
                <button
                  onClick={disconnect}
                  type="button"
                  className="w-fit text-link"
                >
                  Disconnect
                </button>
              </div>
            </div>
            <div className="sm:hidden py-5 space-y-5">
              <BuyADomainButton customButtonStyle="rounded-[15px] px-3 py-2 font-bold text-base font-azeret text-action-button-text w-full flex justify-center" />
              <div className="flex justify-between w-full items-center">
                <span className="text-wallet-connect-text text-2xl font-azeret font-semibold">
                  {themeDescription}
                </span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </Popover.Panel>
      </Popover>
    );
  }

  return (
    <button
      className={twMerge(
        "h-12 rounded-2xl px-4 flex items-center justify-center space-x-2 drop-shadow-2xl drop-shadow-white",
        width ? `${width}px` : "sm:w-[196px] w-[50px]",
        green
          ? "bg-gradient-to-r from-[#00F0FF] to-[#CBFF5E]"
          : " bg-gradient-to-b from-glass-bg to-bg-wallet-connect-bg border-t border-t-[#FFFFFF33]"
      )}
      onClick={() => {
        setVisible(true);
      }}
      type="button"
    >
      <div className="flex items-center justify-center gap-2">
        <Image
          width={19}
          height={17}
          alt="wallet"
          src={green ? "/wallet/wallet-blue.svg" : "/wallet/wallet-white.svg"}
        />
        {green ? (
          <span className="font-bold font-azeret text-base w-fit normal-case text-[#03021A]">
            Login with your wallet
          </span>
        ) : (
          <span
            className={twMerge(
              "font-bold font-azeret text-base w-fit text-white normal-case hidden sm:inline-flex",
              green ? "text-[#03021A]" : "text-white"
            )}
          >
            {connecting ? "Connecting..." : "Connect wallet"}
          </span>
        )}
      </div>
    </button>
  );
};
