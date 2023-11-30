"use client";
import { useConnection } from "@solana/wallet-adapter-react";
import RecordsTable from "@/app/components/RecordsTable";
import LinkButton from "@/app/components/LinkButton";
import Image from "next/image";

type DomainLinksPageParams = {
  domain: string;
};

const DomainLinksPage = ({ params }: { params: DomainLinksPageParams }) => {
  const { connection } = useConnection();
  const domain = params.domain;

  return (
    <div className="flex flex-col items-center justify-start w-full h-full mt-10">
      <RecordsTable />
    </div>
  );
};

export default DomainLinksPage;
