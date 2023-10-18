import React, { createContext, useState } from "react";

const RecordsPerDomainContext = createContext({
  recordsPerDomain: {},
  setRecordsPerDomain: () => {},
});

export const RecordsPerDomainProvider = ({ children }) => {
  const [recordsPerDomain, setRecordsPerDomain] = useState([]);
  const [profilePic, setProfilePic] = useState("");

  return (
    <RecordsPerDomainContext.Provider
      value={{
        recordsPerDomain,
        setRecordsPerDomain,
        profilePic,
        setProfilePic,
      }}
    >
      {children}
    </RecordsPerDomainContext.Provider>
  );
};

export default RecordsPerDomainContext;
