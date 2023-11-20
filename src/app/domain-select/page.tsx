"use client";
import Header from "../components/Header";
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

  useEffect(() => {
    if (!connected) {
      router.push("login-page");
      setSelectedDomain("");
    } else if (
      !domainsLoading &&
      !tokenizedDomainsLoading &&
      domainsData?.length === 0 &&
      tokenizedDomainsOwned?.length === 0
    ) {
      router.push("login-page");
      setSelectedDomain("");
    }
  }, [
    connected,
    domainsLoading,
    tokenizedDomainsLoading,
    domainsData,
    tokenizedDomainsOwned,
  ]);

  return (
    <>
      <Header />
      <div className="w-full min-h-screen mb-10 flex flex-col">
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col items-center">
            <RecordsTable />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DomainSelectPage;
