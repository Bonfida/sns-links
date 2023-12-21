import { useContext } from "react";
import SelectedDomainContext from "@/context/selectedDomain";
import { useFetchDomains } from "@/hooks/useFetchDomains";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";

const DomainDropdown = ({ currentDomain }: { currentDomain: string }) => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const { setSelectedDomain } = useContext(SelectedDomainContext);
  const router = useRouter();

  const { data: domainsOwned, isLoading: domainsLoading } = useFetchDomains(
    connection,
    publicKey
  );

  let groupedDomains: { [key: string]: string[] } = {};

  if (!domainsLoading && domainsOwned && domainsOwned.length > 0) {
    groupedDomains = domainsOwned.reduce(
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
    router.push(`${domain}`);
  };

  return (
    <div className="flex flex-col items-center flex-grow mt-5 space-y-5 md:justify-start md:mt-0">
      <div className="form-control w-full  relative mt-1 p-[2px]">
        <div className="relative z-10 rounded-xl">
          <select
            className="w-full h-4 p-2 text-sm select rounded-xl md:p-2 focus:outline-none"
            defaultValue="Select a domain"
            onChange={handleDomainSelect}
          >
            <option disabled value="Select a domain">
              {currentDomain}.sol
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
