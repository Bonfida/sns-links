import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { abbreviatePubkey } from "@/utils/abbreviate-pubkey/abbreviatePubkey";
import { useRouter } from "next/navigation";
import ProfilePic from "../ProfilePic/ProfilePic";
import { twMerge } from "tailwind-merge";
import { useSafeState, usePrevious } from "ahooks";
import axios from "axios";
import { Popover } from "@headlessui/react";
import { usePopper } from "react-popper";
import { useState, useEffect } from "react";
import { useFetchFavoriteDomain } from "../../../hooks/useFetchFavoriteDomain";
import { Toggle } from "@bonfida/components";
import { PublicKey } from "@solana/web3.js";
import Image from "next/image";
import { useModalContext } from "../../../hooks/useModalContext";

export const WalletConnect = ({ width }: { width?: string }) => {
  const { setVisible, visible } = useWalletModal();
  const { setVisible: setVisibleContext, visible: visibleContext } =
    useModalContext();
  const { connected, publicKey, connecting, disconnect } = useWallet();
  const { connection } = useConnection();
  const { data: favoriteDomain } = useFetchFavoriteDomain(
    connection,
    publicKey!
  );
  const router = useRouter();

  const previous = usePrevious(visible);

  useEffect(() => {
    if (previous && visibleContext) {
      setVisibleContext(false);
    }
  }, [visible]);

  let [referenceElement, setReferenceElement] = useState<HTMLButtonElement>();
  let [popperElement, setPopperElement] = useState<HTMLDivElement>();
  let { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "top-start",
  });

  if (connected && publicKey) {
    return (
      <Popover>
        {/* Button */}
        <Popover.Button
          // @ts-ignore
          ref={setReferenceElement}
        >
          <div
            className={twMerge(
              "bg-gradient-to-r from-[#00F0FF] to-[#CBFF5E] p-[1.5px] rounded-[16px] h-[52px]",
              width ? width : "w-[182px]",
              "hover:shadow-wallet-connect"
            )}
          >
            <div className="bg-[#13122b] h-full w-full rounded-[14px] px-4 flex items-center justify-center lg:justify-start space-x-2">
              <ProfilePic
                domain={favoriteDomain}
                hideEdit={true}
                customHeight={24}
                customWidth={24}
              />

              <span
                className={twMerge("font-bold text-white font-azeret w-fit")}
              >
                {favoriteDomain
                  ? formatFav(favoriteDomain!, publicKey)
                  : abbreviatePubkey(publicKey, 4)}
              </span>
            </div>
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
    <div
      className={twMerge(
        "bg-gradient-to-r from-[#00F0FF] to-[#CBFF5E] p-[2px] rounded-[16px] h-[52px]",
        width ? width : "w-[182px]",
        "relative z-30"
      )}
    >
      <button
        className="bg-[#13122b] h-full w-full rounded-[14px] px-4 flex items-center justify-center space-x-2"
        onClick={() => {
          setVisible(true);
        }}
        type="button"
      >
        <span className="font-bold font-azeret text-[16px] w-fit text-white normal-case">
          {connecting ? "Connecting..." : "Connect wallet"}
        </span>
      </button>
    </div>
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
