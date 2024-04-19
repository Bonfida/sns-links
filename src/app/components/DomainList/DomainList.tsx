"use client";
import { useFetchDomains } from "@/hooks/useFetchDomains";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { DomainListItem } from "../Buttons/DomainListButton";

const DomainList = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const { data: domainsOwned, isLoading: domainsLoading } = useFetchDomains(
    connection,
    publicKey
  );

  return (
    <div className=" flex flex-col items-center mt-10">
      {!domainsLoading && (
        <div className=" md:w-[800px] w-[450px] space-y-3">
          {domainsOwned?.map((domain) => {
            return <DomainListItem domain={domain} key={domain} />;
          })}
        </div>
      )}
    </div>
  );
};

export default DomainList;
