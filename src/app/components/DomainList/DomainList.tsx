"use client";
import { useFetchDomains } from "@/hooks/useFetchDomains";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { DomainListItem } from "./DomainListItem";
import { useEffect, useState } from "react";

const DomainList = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const { data: domainsOwned, isLoading: domainsLoading } = useFetchDomains(
    connection,
    publicKey
  );

  //Search
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDomains, setFilteredDomains] = useState<string[]>([]);

  useEffect(() => {
    if (!domainsOwned) {
      setFilteredDomains([]);
    } else if (searchTerm === "") {
      setFilteredDomains(domainsOwned);
    } else {
      const filtered = domainsOwned.filter((domain) =>
        domain.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDomains(filtered);
    }
  }, [searchTerm, domainsOwned]);

  return (
    <div className=" flex flex-col items-center mt-10">
      <input
        type="text"
        placeholder="Search domains..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 sm:w-1/4 w-1/2 px-4 py-2 border rounded-lg bg-[#FFFFFF12] text-white border-[#FFFFFF3D]"
      />
      {!domainsLoading && (
        <div className=" md:w-[800px] sm:w-[450px] w-screen px-3 sm:px-0 space-y-3">
          {filteredDomains?.map((domain) => {
            return <DomainListItem domain={domain} key={domain} />;
          })}
        </div>
      )}
    </div>
  );
};

export default DomainList;
