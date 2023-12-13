"use client";
import { useConnection } from "@solana/wallet-adapter-react";
import { useFetchRecords } from "../../../../hooks/useFetchRecords";
import LinkButton from "@/app/components/LinkButton";
import Image from "next/image";
import { GenericLoading } from "@bonfida/components";
import Footer from "@/app/components/Footer";
import { useEffect, useState } from "react";
import NoLinksFoundModal from "@/app/components/NoLinksFoundModal";

type UserPageParams = {
  domain: string;
};

const UserPage = ({ params }: { params: UserPageParams }) => {
  const { connection } = useConnection();
  const domain = params.domain;
  const { data: recordsData, isLoading } = useFetchRecords(connection, domain);
  const [isMounted, setIsMounted] = useState(false);
  let recordsExist;

  if (!isLoading) {
    recordsExist = Object.values(recordsData!.records).every(
      (el) => el !== undefined
    );
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-start w-screen h-screen ]">
      <div className="flex flex-col items-center space-y-1">
        {isLoading ? (
          <GenericLoading className="w-[100px] h-[100px] rounded-full" />
        ) : (
          <Image
            alt=""
            width={50}
            height={50}
            src={recordsData?.pic ?? "/default-profile.svg"}
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
          {recordsExist ? (
            Object.entries(recordsData!.records).map(([key, value]) => {
              if (value !== undefined) {
                return <LinkButton key={key} name={key} value={value} />;
              }
              return null;
            })
          ) : (
            <NoLinksFoundModal />
          )}
        </div>
      )}
    </div>
  );
};

export default UserPage;
