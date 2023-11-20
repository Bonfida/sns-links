import { useContext, useEffect } from "react";
import SelectedDomainContext from "@/context/selectedDomain";
import { useFetchDomains } from "@/hooks/useFetchDomains";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

const DomainDropdown = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const { setSelectedDomain } = useContext(SelectedDomainContext);

  const { data: domainsOwned, isLoading: domainsLoading } = useFetchDomains(
    connection,
    publicKey
  );

  let groupedDomains = [];

  if (!domainsLoading) {
    const sortedDomains = [...domainsOwned].sort();
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
    <div className="flex items-center md:justify-start flex-col md:mt-0 mt-20 space-y-5">
      <div className="form-control w-full  relative mt-1 p-[2px]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00F0FF] to-[#CBFF5E] rounded-lg p-2"></div>
        <div className="relative z-10 rounded-lg">
          <select
            className="select w-full rounded-lg md:text-xs md:p-2 p-2 h-4 focus:outline-none"
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
