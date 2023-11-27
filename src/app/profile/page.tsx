"use client";
import Header from "../components/Topbar";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import SelectedDomainContext from "@/context/selectedDomain";
import { useFetchDomains } from "@/hooks/useFetchDomains";
import { useFetchTokenizedDomains } from "@/hooks/useFetchTokenizedDomains";
import RecordsTable from "../components/RecordsTable";
import Footer from "../components/Footer";

const DomainSelectPage = () => {
  const router = useRouter();
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();
  const { setSelectedDomain } = useContext(SelectedDomainContext);
  const { data: domainsData, isLoading: domainsLoading } = useFetchDomains(
    connection,
    publicKey
  );
  const { data: tokenizedDomainsOwned, isLoading: tokenizedDomainsLoading } =
    useFetchTokenizedDomains(connection, publicKey);

  return (
    <>
      <div className="w-full min-h-screen">
        <RecordsTable />
      </div>
    </>
  );
};

export default DomainSelectPage;
