import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { abbreviatePubkey } from "@/utils/abbreviate-pubkey/abbreviatePubkey";
import { useRouter } from "next/navigation";
import ProfilePic from "../ProfilePic/ProfilePic";
import { twMerge } from "tailwind-merge";
import { usePrevious } from "ahooks";
import { Popover } from "@headlessui/react";
import { usePopper } from "react-popper";
import { useState, useEffect } from "react";
import { PublicKey } from "@solana/web3.js";
import { useModalContext } from "../../../hooks/useModalContext";
import { useDomainsForOwner, useFavoriteDomain } from "@bonfida/sns-react";
import Image from "next/image";

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

  // Domain
  const { result: userDomainList, loading: isuserDomainListLoading } =
    useDomainsForOwner(connection, publicKey);

  const { result: favoriteDomain, loading: isFaovriteDomainLoading } =
    useFavoriteDomain(connection, publicKey);

  const loading = isuserDomainListLoading || isFaovriteDomainLoading;

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
          <div className="bg-gradient-to-b from-[#E8DCEF29] to-[#E8DCEF00] h-12 rounded-2xl px-4 flex items-center justify-center space-x-2 border-t border-t-[#FFFFFF33] sm:w-[196px] w-[50px]">
            <div className="sm:inline-block hidden">
              <ProfilePic
                domain={favoriteDomain?.domain || ""}
                hideEdit={true}
                customHeight={24}
                customWidth={24}
              />
            </div>
            <div className="sm:hidden inline-block">
              <Image
                width={24}
                height={24}
                alt="wallet"
                src="/wallet-white.svg"
              />
            </div>
            <span className="font-bold text-white font-azeret w-fit sm:inline-block hidden">
              {displayedUser}
            </span>
          </div>
        </Popover.Button>

        {/* Dropdown */}
        <Popover.Panel
          // @ts-ignore
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
          className="absolute w-full md:w-[200px] z-50"
        >
          <div className="bg-wallet-connect-popout-bg rounded-[24px] border-[1px] border-[#2A2A51] p-[8px] md:mt-2 mb-2 md:mb-0">
            <div className="flex flex-col pl-[20px] space-y-2 text-link font-azeret font-medium text-[16px] my-2">
              <button
                onClick={() =>
                  router.push(`/profile/pubkey=${publicKey.toBase58()}`)
                }
                type="button"
                className="w-fit"
              >
                View profile
              </button>
              <button
                onClick={() => setVisible(true)}
                type="button"
                className="w-fit"
              >
                Change wallet
              </button>

              <div className="w-[95%] my-0 divider" />
              <button onClick={disconnect} type="button" className="w-fit">
                Disconnect
              </button>
            </div>
          </div>
        </Popover.Panel>
      </Popover>
    );
  }

  return (
    <button
      style={{ width: width ? `${width}px` : "196px" }}
      className={twMerge(
        " h-12 rounded-2xl px-4 flex items-center justify-center space-x-2",
        green
          ? "bg-gradient-to-r from-[#00F0FF] to-[#CBFF5E]"
          : " bg-gradient-to-b from-[#E8DCEF29] to-[#E8DCEF00] border-t border-t-[#FFFFFF33]"
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
          src={green ? "/wallet-blue.svg" : "/wallet-white.svg"}
        />
        <span
          className={twMerge(
            "font-bold font-azeret text-base w-fit text-white normal-case",
            green ? "text-[#03021A]" : "text-white"
          )}
        >
          {connecting
            ? "Connecting..."
            : green
            ? "Login with your wallet"
            : "Connect wallet"}
        </span>
      </div>
    </button>
  );
};

const FAV_LIMIT_16px = 11;
const FAV_LIMIT_SM = 13;

const formatFav = (favoriteDomain: string, publicKey: PublicKey): string => {
  if (favoriteDomain.length <= FAV_LIMIT_SM) {
    return favoriteDomain + ".sol";
  }
  return abbreviatePubkey(publicKey, 4);
};
