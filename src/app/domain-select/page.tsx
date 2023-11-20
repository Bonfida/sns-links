"use client";
import Header from "../components/Header";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useFetchRecords } from "@/hooks/useFetchRecords";
import SelectedDomainContext from "@/context/selectedDomain";
import { useFetchDomains } from "@/hooks/useFetchDomains";
import RecordsTable from "../components/RecordsTable";
import LinkShareButton from "../components/LinkShareButton";
import Footer from "../components/Footer";
import ProfilePic from "../components/ProfilePic";

const DomainSelectPage = () => {
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();
  const { selectedDomain, setSelectedDomain } = useContext(
    SelectedDomainContext
  );
  const router = useRouter();

  const { data: domainsData, isLoading: domainsLoading } = useFetchDomains(
    connection,
    publicKey
  );

  useEffect(() => {
    if (!connected) {
      router.push("login-page");
      setSelectedDomain("");
    } else if (connected && !domainsLoading && domainsData?.length === 0) {
      router.push("login-page");
      setSelectedDomain("");
    }
  }, [connected]);

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
