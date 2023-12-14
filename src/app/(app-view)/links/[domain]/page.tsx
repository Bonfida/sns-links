"use client";
import RecordsTable from "@/app/components/RecordsTable";
import LinkButton from "@/app/components/LinkButton";
import Image from "next/image";
import RecordsTableSkeleton from "@/app/components/Skeleton/RecordsTableSkeleton";
import { useFetchRecords } from "@/hooks/useFetchRecords";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

type DomainLinksPageParams = {
  domain: string;
};

const DomainLinksPage = ({ params }: { params: DomainLinksPageParams }) => {
  const { connection } = useConnection();
  const domain: string = params.domain;

  const { data: recordsData, isLoading: recordsLoading } = useFetchRecords(
    connection,
    domain
  );

  return (
    <div className="flex flex-col items-center justify-start w-full h-full mt-10">
      {recordsLoading ? (
        <RecordsTableSkeleton />
      ) : (
        <RecordsTable
          domain={domain}
          recordsData={recordsData}
          recordsLoading={recordsLoading}
        />
      )}
    </div>
  );
};

export default DomainLinksPage;
