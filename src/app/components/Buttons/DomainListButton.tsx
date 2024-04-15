import { useContext, useState } from "react";
import SelectedDomainContext from "@/context/selectedDomain";
import { useConnection } from "@solana/wallet-adapter-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useFetchDomains } from "@/hooks/useFetchDomains";
import { useRouter } from "next/navigation";
import { Button, useToastContext } from "@bonfida/components";
import Image from "next/image";
import { useFavouriteDomain } from "@/hooks/useFetchFavoriteDomain";
import { derive } from "@/utils/derive";
import { registerFavourite } from "@bonfida/name-offers";
import { NAME_OFFERS_ID } from "@bonfida/spl-name-service";
import { makeTx } from "@/utils/makeTx";

const DomainListButton = ({ domain }: { domain: string }) => {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const router = useRouter();
  const { setSelectedDomain, selectedDomain } = useContext(
    SelectedDomainContext
  );
  const { toast } = useToastContext();
  const [selectedFavorite, setSelectedFavorite] = useState(false);
  const { mutate: mutateFavoriteDomain, data: favoriteDomain } =
    useFavouriteDomain(publicKey?.toBase58(), {
      manual: true,
    });
  const isFavorite = domain === favoriteDomain;

  const handleEditClick = () => {
    setSelectedDomain(domain);

    router.push(`/links/${domain}`);
  };

  const handleFavoriteUpdate = async () => {
    setSelectedFavorite(true);
    if (!publicKey || !signTransaction || !domain) return;

    try {
      const { pubkey } = await derive(domain);
      const ix = await registerFavourite(pubkey, publicKey!, NAME_OFFERS_ID);
      const { signature, success } = await makeTx(
        connection,
        publicKey!,
        ix,
        signTransaction!,
        toast
      );

      console.log({ signature });
      if (success) {
        mutateFavoriteDomain(domain);
      }
    } catch (err) {
      setSelectedFavorite(false);
      console.log(err);
    }
  };
  return (
    <div className="flex justify-between w-full bg-white/[7%] border-t-[1px] border-white/[24%] rounded-[24px] p-2">
      <div className="space-x-2 flex justify-center items-center">
        <button className="ml-2" onClick={handleFavoriteUpdate}>
          <Image
            src={selectedFavorite ? "/solid-star.svg" : "/star-outline.svg"}
            alt="favorite"
            width={24}
            height={24}
          />
        </button>
        <span className="text-white text-lg">{domain}.sol</span>
      </div>
      <div className="flex gap-2 justify-center items-center">
        {isFavorite && <PrimaryTag />}
        <button
          className="text-white text-sm w-[50px] px-1 py-3 bg-[#03021A] rounded-[16px] flex items-center justify-center border-t-[1px] border-white/[20%]"
          onClick={handleEditClick}
        >
          <Image src="/pen.svg" alt="edit records" width={24} height={24} />
        </button>
      </div>
    </div>
  );
};

export const PrimaryTag = () => {
  return (
    <div className=" py-2 px-4 border border-white/[24] rounded-[14px] flex items-center justify-center">
      <span className="font-semibold text-[14px] font-azeret text-white">
        primary
      </span>
    </div>
  );
};

export default DomainListButton;
