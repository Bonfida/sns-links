"use client";
import RecordsTable from "@/app/components/Tables/RecordsTable";
import RecordsTableSkeleton from "@/app/components/Skeleton/RecordsTableSkeleton";
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

export default DomainLinksPageComponent;
