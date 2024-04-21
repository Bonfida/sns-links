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
  style,
}: {
  width?: string;
  style: "navy" | "green";
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
          <div
            className={twMerge(
              " bg-gradient-to-b from-[#E8DCEF29] to-[#E8DCEF00] h-12 rounded-2xl px-4 flex items-center justify-center space-x-2 border-t border-t-[#FFFFFF33]",
              width ? width : "w-[196px]"
            )}
          >
            <ProfilePic
              domain={favoriteDomain?.domain || ""}
              hideEdit={true}
              customHeight={24}
              customWidth={24}
            />

            <span className={twMerge("font-bold text-white font-azeret w-fit")}>
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
          <div className="bg-[#13122B] rounded-[24px] border-[1px] border-[#2A2A51] p-[8px] md:mt-2 mb-2 md:mb-0">
            <div className="flex flex-col pl-[20px] space-y-2 text-white font-azeret font-medium text-[16px] my-2">
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
      className={twMerge(
        " bg-gradient-to-b from-[#E8DCEF29] to-[#E8DCEF00] h-12 rounded-2xl px-4 flex items-center justify-center space-x-2 border-t border-t-[#FFFFFF33]",
        width ? width : "w-[196px]"
      )}
      onClick={() => {
        setVisible(true);
      }}
      type="button"
    >
      <div className="flex items-center justify-center gap-2">
        <Image width={19} height={17} alt="wallet" src="/wallet.svg" />
        <span className="font-bold font-azeret text-base w-fit text-white normal-case">
          {connecting ? "Connecting..." : "Connect wallet"}
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
