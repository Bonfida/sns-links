"use client";
import { useConnection } from "@solana/wallet-adapter-react";
import RecordsTable from "@/app/components/RecordsTable";
import LinkButton from "@/app/components/LinkButton";
import Image from "next/image";
import RecordsTableSkeleton from "@/app/components/Skeleton/RecordsTableSkeleton";

type DomainLinksPageParams = {
  domain: string;
};

const DomainLinksPage = ({ params }: { params: DomainLinksPageParams }) => {
  const { connection } = useConnection();
  const domain: string = params.domain;

  return (
    <div className="flex flex-col items-center justify-start w-full h-full mt-10">
      <RecordsTable domain={domain} />
      {/* <RecordsTableSkeleton /> */}
    </div>
  );
};

export default DomainLinksPage;
