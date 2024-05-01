"use client";
import { useFetchDomains } from "@/hooks/useFetchDomains";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { DomainListItem } from "./DomainListItem";
import { useEffect, useMemo, useState } from "react";
import { useFavouriteDomain } from "@/hooks/useFetchFavoriteDomain";

const DomainList = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  //Domains
  const { data: domainsOwned, isLoading: domainsLoading } = useFetchDomains(
    connection,
    publicKey
  );

  const { data: favoriteDomain } = useFavouriteDomain(publicKey?.toBase58(), {
    manual: true,
  });

  const sortedDomains = useMemo(() => {
    if (!domainsOwned) return [];

    return favoriteDomain && domainsOwned.includes(favoriteDomain)
      ? [...domainsOwned].sort((a, b) =>
          a === favoriteDomain ? -1 : b === favoriteDomain ? 1 : 0
        )
      : domainsOwned;
  }, [domainsOwned, favoriteDomain]);

  //Search
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDomains, setFilteredDomains] = useState<string[] | undefined>(
    []
  );

  useEffect(() => {
    if (!domainsOwned) {
      setFilteredDomains([]);
    } else if (searchTerm === "") {
      setFilteredDomains(sortedDomains);
    } else {
      const filtered = domainsOwned.filter((domain) =>
        domain.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDomains(filtered);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, sortedDomains]);

  return (
    <div className="flex flex-col items-center h-full">
      <input
        type="text"
        placeholder="Search domains..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 sm:w-1/4 w-1/2 px-4 py-2 border rounded-lg bg-input-bg text-search-input-text border-search-input-border"
      />
      {!domainsLoading && (
        <div className="overflow-y-auto md:w-[800px] sm:w-[450px] w-screen px-3 sm:px-0 space-y-3 max-h-[70vh]">
          {filteredDomains?.map((domain) => {
            return <DomainListItem domain={domain} key={domain} />;
          })}
        </div>
      )}
    </div>
  );
};

export default DomainList;
