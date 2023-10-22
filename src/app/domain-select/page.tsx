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
import SelectedDomainContext from "@/context/selectedDomain";
import RecordsTable from "../components/RecordsTable";
import LinkShareButton from "../components/LinkShareButton";

const DomainSelectPage = () => {
  const { connected } = useWallet();
  const { connection } = useConnection();
  const { domainsOwned, setDomainsOwned } = useContext(DomainsOwnedContext);
  const { recordsPerDomain, setRecordsPerDomain, setProfilePic, profilePic } =
    useContext(RecordsPerDomainContext);
  const { selectedDomain } = useContext(SelectedDomainContext);
  const router = useRouter();
  const { records, pic, loading } = useFetchRecords(connection, selectedDomain);

  useEffect(() => {
    if (!connected || domainsOwned.length === 0) {
      setDomainsOwned([]);
      router.push("login-page");
    }
  }, [connected]);

  useEffect(() => {
    if (records && !loading) {
      setRecordsPerDomain(records);
      setProfilePic(pic);
    }
  }, [records, loading]);

  return (
    <div className="w-full">
      <Header />
      <div className="">
        {domainsOwned.length !== 0 ? (
          <DomainDropdown domainsOwned={domainsOwned} />
        ) : null}
        <div className="">
          {selectedDomain.length !== 0 ? (
            <div className="flex flex-col justify-center items-center mt-10">
              <LinkShareButton />
              <div className="mt-5 flex flex-col justify-center items-center w-full">
                {profilePic ? (
                  <img src={profilePic} className="w-28 rounded-full" />
                ) : (
                  <img src="/smiley-face.png" className="w-28" />
                )}
                <RecordsTable />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default DomainSelectPage;
