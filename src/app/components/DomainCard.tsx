"use client";
import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import EditRecordModal from "./EditRecordModal";
import SelectedDomainContext from "@/context/selectedDomain";

const DomainCard = ({ domain }: { domain: string }) => {
  const router = useRouter();
  const { setSelectedDomain } = useContext(SelectedDomainContext);

  const handleClick = () => {
    setSelectedDomain(domain);
    router.push(`/links/${domain}`);
  };

  return (
    <div className="group h-[352px] w-[352px] items-center my-3 flex flex-col border border-[#2A2A51] rounded-xl justify-center bg-[url('/domains/regular.svg')] bg-cover mx-5">
      <div className="flex items-center justify-center h-1/2">
        <h1 className="font-bold text-center text-[#2A2A51] text-2xl">
          {domain}.sol
        </h1>
      </div>
      <button
        className="px-3 py-4 bg-[#2A2A51] rounded-xl text-white font-semibold active:translate-y-1 transition-all"
        onClick={handleClick}
      >
        View Links
      </button>
    </div>
  );
};

export default DomainCard;
