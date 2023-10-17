import React, { createContext, useState } from "react";

const RecordsPerDomainContext = createContext({
  recordsPerDomain: [],
  setRecordsPerDomain: () => {},
});

export const RecordsPerDomainProvider = ({ children }) => {
  const [recordsPerDomain, setRecordsPerDomain] = useState([]);

  return (
    <RecordsPerDomainContext.Provider
      value={{ recordsPerDomain, setRecordsPerDomain }}
    >
      {children}
    </RecordsPerDomainContext.Provider>
  );
};

export default RecordsPerDomainContext;
