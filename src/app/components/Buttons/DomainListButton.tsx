import { useContext, useState } from "react";
import SelectedDomainContext from "@/context/selectedDomain";
import { useConnection } from "@solana/wallet-adapter-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useFetchDomains } from "@/hooks/useFetchDomains";
import { useRouter } from "next/navigation";
import { Button } from "@bonfida/components";
import Image from "next/image";

const DomainListButton = ({ domain }: { domain: string }) => {
  const router = useRouter();
  const { setSelectedDomain, selectedDomain } = useContext(
    SelectedDomainContext
  );

  const handleEditClick = () => {
    setSelectedDomain(domain);

    router.push(`/links/${domain}`);
  };

  return (
    <div className="flex justify-between w-full bg-white/[7%] border-t-[1px] border-white/[24%] rounded-[24px] p-2">
      <div className="space-x-2 flex justify-center items-center">
        <button className="text-white text-sm ml-2">
          <Image src="/star.svg" alt="favorite" width={24} height={24} />
        </button>
        <span className="text-white text-lg">{domain}.sol</span>
      </div>

      <button
        className="text-white text-sm w-[50px] px-1 py-3 bg-[#03021A] rounded-[16px] flex items-center justify-center border-t-[1px] border-white/[20%]"
        onClick={handleEditClick}
      >
        <Image src="/pen.svg" alt="edit records" width={24} height={24} />
      </button>
    </div>
  );
};

export default DomainListButton;
