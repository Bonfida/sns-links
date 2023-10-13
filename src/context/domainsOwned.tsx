import React, { createContext, useState, useContext } from 'react';

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
