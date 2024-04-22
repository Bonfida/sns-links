"use client";
import RecordsList from "@/app/components/RecordsList/RecordsList";
import RecordsTableSkeleton from "../Skeletons/RecordsTableSkeleton";
import { useFetchRecords } from "@/hooks/useFetchRecords";
import { useConnection } from "@solana/wallet-adapter-react";

type DomainLinksPageParams = {
  domain: string;
};

const DomainLinksPageComponent = ({
  params,
}: {
  params: DomainLinksPageParams;
}) => {
  const domain: string = params.domain;

  return (
    <div className="flex flex-col items-center justify-start w-screen h-screen mt-10 overflow-auto">
      <RecordsList domain={domain} />
    </div>
  );
};

export default DomainLinksPageComponent;
