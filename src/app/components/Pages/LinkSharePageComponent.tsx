"use client";
import { useConnection } from "@solana/wallet-adapter-react";
import { useFetchRecords } from "../../../hooks/useFetchRecords";
import LinkButton from "@/app/components/Buttons/LinkButton";
import Image from "next/image";
import { GenericLoading } from "@bonfida/components";
import { useEffect, useState } from "react";
import NoLinksFoundModal from "@/app/components/Modals/NoLinksFoundModal";
import { useDomainsInfo } from "@/hooks/useDomainsInfo";
import CreateYourOwnButton from "@/app/components/Buttons/CreateYourOwn";
import { LinkShareParams } from "@/app/types/LinkShareParams";

const LinkSharePageComponent = ({ params }: { params: LinkShareParams }) => {
  const { connection } = useConnection();
  const domain = params.domain;
  const { data: recordsData, isLoading } = useFetchRecords(connection, domain);
  const [isMounted, setIsMounted] = useState(false);
  const { data: domainInfo, keys } = useDomainsInfo([domain]);
  const domainKey = keys.find((e) => e.domain === domain)?.pubkey;
  let recordsExist;

  const content =
    domainKey &&
    domainInfo
      ?.get(domainKey.toBase58())
      ?.data?.toString()
      .trimStart()
      .trimEnd();

  if (!isLoading) {
    recordsExist = Object.values(recordsData!.records).some(
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
    <div className="flex flex-col items-center justify-start w-screen h-screen p-10">
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
        <span>{content}</span>
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
      {/* Spacer to push the button to the bottom */}
      <div className="flex-grow"></div>
      <CreateYourOwnButton />
    </div>
  );
};

export default LinkSharePageComponent;
