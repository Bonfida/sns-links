const DomainDropdown = ({ groupedDomains }) => {
  return (
    <div className="h-screen w-full flex items-center justify-start flex-col md:mt-0 mt-20 space-y-5">
      <h1 className="text-3xl font-bold text-white font-azeret md:mt-0 text-center">
        Which domain's links would you like to view?
      </h1>
      <div className="form-control w-full max-w-xs relative mt-1 p-[2px]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00F0FF] to-[#CBFF5E] rounded-lg p-2"></div>
        <div className="relative z-10  rounded-lg">
          <select
            className="select w-full rounded-lg text-lg p-4 h-14 focus:outline-none"
            defaultValue="Select a domain"
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