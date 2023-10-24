"use client";
import Header from "../components/Header";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useFetchRecords } from "@/hooks/useFetchRecords";
import DomainDropdown from "../components/DomainDropdown";
import SelectedDomainContext from "@/context/selectedDomain";
import { useFetchDomains } from "@/hooks/useFetchDomains";
import RecordsTable from "../components/RecordsTable";
import LinkShareButton from "../components/LinkShareButton";

const DomainSelectPage = () => {
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();
  const { selectedDomain } = useContext(SelectedDomainContext);
  const router = useRouter();
  const { data: recordsData, isLoading: recordsLoading } = useFetchRecords(
    connection,
    selectedDomain
  );
  const { data: domainsData, isLoading: domainsLoading } = useFetchDomains(
    connection,
    publicKey
  );

  useEffect(() => {
    if (!connected) {
      router.push("login-page");
    } else if (connected && !domainsLoading) {
      if (domainsData.length === 0) {
        router.push("login-page");
      }
    }
  }, [connected]);

  return (
    <div className="w-full">
      <Header />
      <div className="">
        {!domainsLoading && domainsData.length !== 0 ? (
          <DomainDropdown domainsOwned={domainsData} />
        ) : null}
        <div className="">
          {selectedDomain.length !== 0 && !recordsLoading ? (
            <div className="flex flex-col justify-center items-center mt-10">
              <LinkShareButton />
              <div className="mt-5 flex flex-col justify-center items-center w-full">
                <img src={recordsData.pic} className="w-28 rounded-full" />
                <RecordsTable connection={connection} domain={selectedDomain} />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default DomainSelectPage;
