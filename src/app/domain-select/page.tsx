"use client";
import DomainSelectButton from "../../components/DomainSelectButton";
import Header from "../../components/Header";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import DomainsOwnedContext from "../../context/domainsOwned";
import RecordsPerDomainContext from "@/context/recordsPerDomain";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useFetchRecords } from "@/hooks/useFetchRecords";
import DomainDropdown from "../components/DomainDropdown";

const DomainSelectPage = () => {
  const { connected } = useWallet();
  const { connection } = useConnection();
  const { domainsOwned, setDomainsOwned } = useContext(DomainsOwnedContext);
  const { recordsPerDomain, setRecordsPerDomain } = useContext(
    RecordsPerDomainContext
  );
  const router = useRouter();
  const { records, loading } = useFetchRecords(connection, domainsOwned[1]);

  useEffect(() => {
    if (!connected || domainsOwned.length === 0) {
      setDomainsOwned([]);
      router.push("login-page");
    }
  }, [connected]);

  useEffect(() => {
    if (!loading) {
      console.log("records", records);
      setRecordsPerDomain(records);
    }
  }, [loading]);

  return (
    <>
      <Header />
      {domainsOwned.length !== 0 ? (
        <DomainDropdown domainsOwned={domainsOwned} />
      ) : null}
    </>
  );
};

export default DomainSelectPage;
