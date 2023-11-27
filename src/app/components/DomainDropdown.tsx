import { useContext, useEffect } from "react";
import SelectedDomainContext from "@/context/selectedDomain";
import { useFetchDomains } from "@/hooks/useFetchDomains";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useFetchTokenizedDomains } from "@/hooks/useFetchTokenizedDomains";

const DomainDropdown = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const { setSelectedDomain } = useContext(SelectedDomainContext);

  const { data: domainsOwned, isLoading: domainsLoading } = useFetchDomains(
    connection,
    publicKey
  );
  const { data: tokenizedDomainsOwned, isLoading: tokenizedDomainsLoading } =
    useFetchTokenizedDomains(connection, publicKey);

  let groupedDomains = [];

  if (!domainsLoading) {
    const combinedArray = domainsOwned?.concat(tokenizedDomainsOwned);
    const sortedDomains = [...combinedArray].sort();
    groupedDomains = sortedDomains.reduce(
      (acc: { [key: string]: string[] }, domain: string) => {
        const initial = domain[0].toUpperCase();
        if (!acc[initial]) {
          acc[initial] = [];
        }
        acc[initial].push(domain);
        return acc;
      },
      {}
    );
  }

  const handleDomainSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const domain = e.target.value.slice(0, -4);
    setSelectedDomain(domain);
  };

  return (
    <div className="flex flex-col items-center flex-grow mt-20 space-y-5 md:justify-start md:mt-0">
      <div className="form-control w-full  relative mt-1 p-[2px]">
        <div className="relative z-10 rounded-xl">
          <select
            className="w-full h-4 p-2 text-sm select rounded-xl md:p-2 focus:outline-none"
            defaultValue="Select a domain"
            onChange={handleDomainSelect}
          >
            <option disabled value="Select a domain">
              Select a domain
            </option>
            {!domainsLoading && groupedDomains
              ? Object.keys(groupedDomains).map((initial) => (
                  <optgroup key={initial} label={initial}>
                    {groupedDomains[initial].map((domain) => (
                      <option key={domain}>{domain}.sol</option>
                    ))}
                  </optgroup>
                ))
              : null}
          </select>
        </div>
      </div>
    </div>
  );
};

export default DomainDropdown;
