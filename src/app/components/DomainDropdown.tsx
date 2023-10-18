import { useContext, useEffect } from "react";
import SelectedDomainContext from "@/context/selectedDomain";

const DomainDropdown = ({ domainsOwned }) => {
  const { selectedDomain, setSelectedDomain } = useContext(
    SelectedDomainContext
  );

  const handleDomainSelect = (e) => {
    const domain = e.target.value.slice(0, -4);
    console.log("domain", domain);
    setSelectedDomain(domain);
  };

  const sortedDomains = [...domainsOwned].sort();

  const groupedDomains = sortedDomains.reduce((acc, domain) => {
    const initial = domain[0].toUpperCase();
    if (!acc[initial]) {
      acc[initial] = [];
    }
    acc[initial].push(domain);
    return acc;
  }, {});

  useEffect(() => {
    console.log("selecte dom", selectedDomain);
  }, []);

  return (
    <div className=" w-full flex items-center justify-start flex-col md:mt-0 mt-20 space-y-5">
      <h1 className="text-3xl font-bold text-white font-azeret md:mt-0 text-center">
        Which domain's links would you like to view?
      </h1>
      <div className="form-control w-full max-w-xs relative mt-1 p-[2px]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00F0FF] to-[#CBFF5E] rounded-lg p-2"></div>
        <div className="relative z-10  rounded-lg">
          <select
            className="select w-full rounded-lg text-lg p-4 h-14 focus:outline-none"
            defaultValue="Select a domain"
            onChange={handleDomainSelect}
          >
            <option disabled value="Select a domain">
              Select a domain
            </option>
            {Object.keys(groupedDomains).map((initial) => (
              <optgroup key={initial} label={initial}>
                {groupedDomains[initial].map((domain) => (
                  <option key={domain}>{domain}.sol</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default DomainDropdown;
