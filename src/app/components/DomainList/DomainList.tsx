"use client";
import { useFetchDomains } from "@/hooks/useFetchDomains";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { DomainListItem } from "./DomainListItem";
import { useEffect, useMemo, useState } from "react";
import { useFavouriteDomain } from "@/hooks/useFetchFavoriteDomain";
import { SearchAction } from "../Search/SearchAction";

const DomainList = () => {
  // Wallet and connection
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

  const [removePreviousFav, setRemovePreviousFav] = useState(false);
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
      <SearchAction
        setSearchTerm={setSearchTerm}
        searchTerm={searchTerm}
        disabled={domainsOwned?.length === 0}
      />
      {!domainsLoading && (
        <div className="overflow-y-auto md:w-[800px] sm:w-[450px] w-screen px-3 sm:px-0 space-y-3 max-h-[70vh]">
          {filteredDomains?.map((domain) => {
            return (
              <DomainListItem
                domain={domain}
                key={domain}
                removePreviousFav={removePreviousFav}
                setRemovePreviousFav={setRemovePreviousFav}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DomainList;
