"use client";
import { useConnection } from "@solana/wallet-adapter-react";
import { useFetchRecords } from "../../../hooks/useFetchRecords";
import LinkButton from "@/app/components/Buttons/LinkButton";
import Image from "next/image";
import { GenericLoading } from "@bonfida/components";
import { useState } from "react";
import NoLinksFoundModal from "@/app/components/Modals/NoLinksFoundModal";
import { useDomainsInfo } from "@/hooks/useDomainsInfo";
import CreateYourOwnButton from "@/app/components/Buttons/CreateYourOwn";
import { LinkShareParams } from "@/app/types/LinkShareParams";

const contactRecords = [Record.Email, Record.Telegram];

const walletRecords = [
  Record.ARWV,
  Record.SOL,
  Record.ETH,
  Record.BTC,
  Record.LTC,
  Record.DOGE,
  Record.SHDW,
  Record.POINT,
  Record.Injective,
  Record.BSC,
];

const socialRecords = [
  Record.Url,
  Record.Discord,
  Record.Github,
  Record.Reddit,
  Record.Twitter,
  Record.Backpack,
];

import { Record } from "@bonfida/spl-name-service";
const LinkSharePageComponent = ({ params }: { params: LinkShareParams }) => {
  const { connection } = useConnection();
  const domain = params.domain;
  const { data: recordsData, isLoading: recordsLoading } = useFetchRecords(
    connection,
    domain
  );
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

  const picRecord = recordsData?.find((record) => {
    return record.record === Record.Pic;
  });

  if (!recordsLoading) {
    recordsExist = recordsData?.some((el) => el.content !== undefined);
  }

  return (
    <div className="flex flex-col items-center justify-start w-screen h-screen p-10 overflow-auto">
      <div className="flex flex-col items-center space-y-1">
        {recordsLoading ? (
          <GenericLoading className="w-24 h-24 rounded-full" />
        ) : (
          <Image
            alt="Profile picture"
            width={200} // Fixed width for better control, adjust as needed
            height={200} // Fixed height for better control, adjust as needed
            src={picRecord?.content ?? "/default-profile.svg"}
            className="rounded-full"
          />
        )}
        <h1 className="font-bold text-white font-azeret">{domain}.sol</h1>
        <span>{content}</span> {/* Ensure 'content' is defined or handled */}
      </div>

      {recordsLoading ? (
        <div className="mt-10">
          {Array.from({ length: 10 }).map((_, idx) => (
            <GenericLoading
              className="w-72 h-12 rounded-md my-2"
              key={`loading-record-${idx}`}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col mt-10 space-y-3">
          <div className="flex justify-center items-center flex-col">
            <div className="flex flex-col gap-3 w-full justify-center items-center">
              <span>Contact</span>
              {recordsData
                ?.filter((record) =>
                  contactRecords.includes(record.record as Record)
                )
                .map((record) => (
                  <LinkButton
                    key={record.record}
                    name={record.record}
                    value={record.content || ""}
                    domain={domain}
                  />
                ))}
              <span>Socials</span>
              {recordsData
                ?.filter((record) =>
                  socialRecords.includes(record.record as Record)
                )
                .map((record) => (
                  <LinkButton
                    key={record.record}
                    name={record.record}
                    value={record.content || ""}
                    domain={domain}
                  />
                ))}
              <span>Wallets</span>
              {recordsData
                ?.filter((record) =>
                  walletRecords.includes(record.record as Record)
                )
                .map((record) => (
                  <LinkButton
                    key={record.record}
                    name={record.record}
                    value={record.content || ""}
                    domain={domain}
                  />
                ))}
            </div>
          </div>
        </div>
      )}
      <div className="flex-grow mt-10"></div>
      <CreateYourOwnButton />
    </div>
  );
};

export default LinkSharePageComponent;
