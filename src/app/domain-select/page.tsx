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
  const { selectedDomain } = useContext(SelectedDomainContext);
  const router = useRouter();

  const { data: domainsData, isLoading: domainsLoading } = useFetchDomains(
    connection,
    publicKey
  );

  useEffect(() => {
    if (!connected) {
      router.push("login-page");
    } else if (connected && !domainsLoading && domainsData?.length === 0) {
      router.push("login-page");
    }
  }, [connected]);

  return (
    <>
      <Header />
      <div className="w-full min-h-screen mb-10 flex flex-col">
        <div className="flex flex-col items-center justify-center">
          <div className="">
            <div className="flex flex-col justify-center items-center mt-10">
              <LinkShareButton />
              <div className="mt-5 flex flex-col justify-center items-center w-full">
                <ProfilePic />
                <div className="flex items-center justify-center">
                  <RecordsTable />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DomainSelectPage;
