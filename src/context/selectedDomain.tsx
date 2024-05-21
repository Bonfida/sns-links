import React, { createContext, useState, ReactNode } from "react";

const SelectedDomainContext = createContext<{
  selectedDomain: string;
  setSelectedDomain: (domain: string) => void;
}>({
  selectedDomain: "",
  setSelectedDomain: () => {},
});

export const SelectedDomainProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
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
