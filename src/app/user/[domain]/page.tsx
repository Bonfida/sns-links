"use client";
import { useRouter } from "next/navigation";
import { Connection } from "@solana/web3.js";
const endpoint = process.env.NEXT_PUBLIC_ENDPOINT;
import { useConnection } from "@solana/wallet-adapter-react";
import { useFetchRecords } from "../../../hooks/useFetchRecords";
import LinkButton from "@/app/components/LinkButton";

type UserPageParams = {
  domain: string;
};

type UserPageData = {
  pic: string;
  records: {};
};

const UserPage = ({ params }: { params: UserPageParams }) => {
  const domain = params.domain;
  const { data, isLoading } = useFetchRecords(
    new Connection(endpoint!),
    domain
  ) as {
    data: UserPageData;
    isLoading: boolean;
  };

  if (!isLoading) {
    return (
      <div className="flex w-screen h-full flex-col justify-start items-center mt-10">
        <div className="flex flex-col items-center space-y-1">
          <img src={data.pic} className="w-28 rounded-full" />
          <h1 className="font-bold text-white font-azeret">{domain}.sol</h1>
        </div>

        <div className="mt-10 flex flex-col space-y-3">
          {data.records
            ? Object.entries(data.records).map(([key, value]) => {
                if (value !== undefined) {
                  return (
                    <LinkButton key={key} linkName={key} linkVal={value} />
                  );
                }
                return null;
              })
            : null}
        </div>
      </div>
    );
  }
};

export default UserPage;
