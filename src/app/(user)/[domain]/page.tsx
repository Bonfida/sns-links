"use client";
import { useConnection } from "@solana/wallet-adapter-react";
import { useFetchRecords } from "../../../hooks/useFetchRecords";
import LinkButton from "@/app/components/LinkButton";
import Image from "next/image";
import { GenericLoading } from "@bonfida/components";

type UserPageParams = {
  domain: string;
};

const UserPage = ({ params }: { params: UserPageParams }) => {
  const { connection } = useConnection();
  const domain = params.domain;
  const { data, isLoading } = useFetchRecords(connection, domain);

  return (
    <div className="flex flex-col items-center justify-start w-screen h-screen mt-10">
      <div className="flex flex-col items-center space-y-1">
        {isLoading ? (
          <GenericLoading className="w-[100px] h-[100px] rounded-full" />
        ) : (
          <Image
            alt=""
            width={50}
            height={50}
            src={data?.pic ?? "/default-profile.svg"}
            className="rounded-full w-28"
          />
        )}
        <h1 className="font-bold text-white font-azeret">{domain}.sol</h1>
      </div>

      {isLoading ? (
        <div className="mt-10">
          {Array(10)
            .fill(null)
            .map((_, idx) => (
              <GenericLoading
                className="w-[288px] h-[50px] rounded-md my-2"
                key={`loading-record-${idx}`}
              />
            ))}
        </div>
      ) : (
        <div className="flex flex-col mt-10 space-y-3">
          {data?.records
            ? Object.entries(data.records).map(([key, value]) => {
                if (value !== undefined) {
                  return <LinkButton key={key} name={key} value={value} />;
                }
                return null;
              })
            : null}
        </div>
      )}
    </div>
  );
};

export default UserPage;
