"use client";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import SelectedDomainContext from "@/context/selectedDomain";
import { useFetchDomains } from "@/hooks/useFetchDomains";
import { useFetchTokenizedDomains } from "@/hooks/useFetchTokenizedDomains";
import NotFoundModal from "../components/NotFoundModal";
import DomainCard from "../components/RecordCard";
import ProfileOverview from "../components/ProfileOverview";

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

  const domains = domainsData?.concat(tokenizedDomainsOwned!);

  return (
    <div className="flex items-start justify-center w-full min-h-screen mt-10">
      {connected ? (
        domains?.length !== 0 ? (
          <div className="flex flex-col items-center justify-center">
            <ProfileOverview />
            <div className="flex flex-wrap items-center justify-center w-3/4 space-x-5 overflow-y-auto">
              {domains?.map((domain) => {
                return <DomainCard domain={domain} key={domain} />;
              })}
            </div>
          </div>
        ) : (
          <NotFoundModal />
        )
      ) : (
        <h2>AYO BUY SOME DOMAINS!!</h2>
      )}
    </div>
  );
};

export default DomainSelectPage;
