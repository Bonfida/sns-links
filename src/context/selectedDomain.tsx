import React, { createContext, useState } from "react";

const SelectedDomainContext = createContext({
  selectedDomain: "",
  setSelectedDomain: () => {},
});

export const SelectedDomainProvider = ({ children }) => {
  const [selectedDomain, setSelectedDomain] = useState("");

  return (
    <SelectedDomainContext.Provider
      value={{ selectedDomain, setSelectedDomain }}
    >
      {children}
    </SelectedDomainContext.Provider>
  );
};

export default SelectedDomainContext;
