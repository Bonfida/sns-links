import React, { createContext, useState } from 'react';

const DomainsOwnedContext = createContext({
  domainsOwned: [],
  setDomainsOwned: () => {},
});

export const DomainsOwnedProvider = ({ children }) => {
  const [domainsOwned, setDomainsOwned] = useState([]);

  return (
    <DomainsOwnedContext.Provider value={{ domainsOwned, setDomainsOwned }}>
      {children}
    </DomainsOwnedContext.Provider>
  );
};

export default DomainsOwnedContext;
