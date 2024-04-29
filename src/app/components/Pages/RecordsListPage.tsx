"use client";
import RecordsList from "@/app/components/RecordsList/RecordsList";
type RecordsListPageParams = {
  domain: string;
};

export const RecordsListPage = ({
  params,
}: {
  params: RecordsListPageParams;
}) => {
  const domain: string = params.domain;

  return (
    <div className="flex flex-col items-center justify-start w-screen h-fit bg-primary-bg">
      <RecordsList domain={domain} />
    </div>
  );
};
