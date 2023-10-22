"use client";
import { useRouter } from "next/navigation";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useFetchRecords } from "../../../hooks/useFetchRecords";
import LinkButton from "@/app/components/LinkButton";

const UserPage = ({ params }) => {
  const router = useRouter();
  const { connection } = useConnection();
  const domain = params.domain;

  const { records, pic } = useFetchRecords(connection, domain);

  console.log("records", records);
  return (
    <div className="flex w-screen h-full flex-col justify-start items-center mt-10">
      <div className="flex flex-col space-y-1">
        {pic ? (
          <img src={pic} className="w-28 rounded-full" />
        ) : (
          <img src="/smiley-face.png" className="w-28" />
        )}
        <h1 className="font-bold text-white font-azeret">{domain}.sol</h1>
      </div>

      <div className="mt-10 flex flex-col space-y-3">
        {records
          ? Object.entries(records).map(([key, value]) => {
              if (value !== undefined) {
                return (
                  <LinkButton key={key} linkName={key} linkValue={value} />
                );
              }
              return null;
            })
          : null}
      </div>
    </div>
  );
};

export default UserPage;
