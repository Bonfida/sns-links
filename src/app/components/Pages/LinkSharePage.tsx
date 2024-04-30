"use client";
import { useConnection } from "@solana/wallet-adapter-react";
import { useFetchRecords } from "../../../hooks/useFetchRecords";
import LinkButton from "@/app/components/Buttons/LinkButton";
import Image from "next/image";
import { GenericLoading } from "@bonfida/components";
import { useState } from "react";
import { NoLinksFoundNotice } from "../Notices/NoLinksFoundModal";
import { useDomainsInfo } from "@/hooks/useDomainsInfo";
import CreateYourOwnButton from "@/app/components/Buttons/CreateYourOwn";
import { LinkShareParams } from "@/app/types/LinkShareParams";
import { Record } from "@bonfida/spl-name-service";

const contactRecords = [
  {
    record: Record.Email,
    interactionType: "newTab",
    urlPrefix: "mailto:",
  },
  {
    record: Record.Telegram,
    interactionType: "newTab",
    urlPrefix: "https://t.me/",
  },
];

const walletRecords = [
  { record: Record.ARWV },
  { record: Record.SOL },
  { record: Record.ETH },
  { record: Record.BTC },
  { record: Record.LTC },
  { record: Record.DOGE },
  { record: Record.SHDW },
  { record: Record.POINT },
  { record: Record.Injective },
  { record: Record.BSC },
];

const socialRecords = [
  { record: Record.Url, interactionType: "newTab", urlPrefix: "" }, // No prefix needed since full http/https link required during input
  { record: Record.Discord, interactionType: "copy" },
  {
    record: Record.Github,
    interactionType: "newTab",
    urlPrefix: "https://github.com/",
  },
  {
    record: Record.Reddit,
    interactionType: "newTab",
    urlPrefix: "https://www.reddit.com/user/",
  },
  {
    record: Record.Twitter,
    interactionType: "newTab",
    urlPrefix: "https://twitter.com/",
  },
  { record: Record.Backpack, interactionType: "copy" },
];

export const LinkSharePage = ({ params }: { params: LinkShareParams }) => {
  const { connection } = useConnection();
  const domain = params.domain;
  const { data: recordsData, isLoading: recordsLoading } = useFetchRecords(
    connection,
    domain
  );
  const { data: domainInfo, keys } = useDomainsInfo([domain]);
  const domainKey = keys?.find((e) => e.domain === domain)?.pubkey;
  const userSocialRecords = recordsData?.filter(
    (record) =>
      socialRecords.some((social) => social.record === record.record) &&
      record.content !== undefined
  );
  const userContactRecords = recordsData?.filter(
    (record) =>
      contactRecords.some((contact) => contact.record === record.record) &&
      record.content !== undefined
  );
  const userWalletRecords = recordsData?.filter(
    (record) =>
      walletRecords.some((wallet) => wallet.record === record.record) &&
      record.content !== undefined
  );

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

  return (
    <div className="flex flex-col items-center justify-start w-full h-full">
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-col">
          {recordsLoading ? (
            <GenericLoading className="w-24 h-24 rounded-full" />
          ) : (
            <Image
              alt="Profile picture"
              width={120}
              height={120}
              src={picRecord?.content ?? "/user/default-profile.svg"}
              className="rounded-full"
            />
          )}
        </div>

        <h1 className="font-bold text-white font-azeret text-2xl">
          {domain}.sol
        </h1>
        <div className="flex flex-col items-center justify-center">
          <span className="text-sm sm:text-base text-[#F8EFF9CC]">Bio</span>
          <span className="text-base sm:text-lg text-[#E8DCEF]">{content}</span>
        </div>
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
              {!!userContactRecords?.length && (
                <>
                  <span>Contact</span>
                  {userContactRecords.map((record) => {
                    const contactRecord = contactRecords.find(
                      (contact) => contact.record === record.record
                    );
                    const finalUrl =
                      contactRecord?.urlPrefix + (record.content || "");
                    return (
                      <LinkButton
                        key={record.record}
                        name={record.record}
                        value={record.content}
                        domain={domain}
                        interactionType={contactRecord?.interactionType}
                        link={finalUrl}
                      />
                    );
                  })}
                </>
              )}

              {!!userSocialRecords?.length && (
                <>
                  <span>Socials</span>
                  {userSocialRecords.map((record) => {
                    const socialRecord = socialRecords.find(
                      (social) => social.record === record.record
                    );
                    if (!socialRecord || socialRecord.urlPrefix === undefined)
                      return null;

                    const finalUrl =
                      socialRecord.urlPrefix + (record.content || "");

                    return (
                      <LinkButton
                        key={record.record}
                        name={record.record}
                        value={finalUrl}
                        domain={domain}
                        interactionType={socialRecord.interactionType}
                        link={finalUrl}
                      />
                    );
                  })}
                </>
              )}
              {!!userWalletRecords?.length && (
                <>
                  <span>Wallets</span>
                  {userWalletRecords.map((record) => {
                    return (
                      <LinkButton
                        key={record.record}
                        name={record.record}
                        value={record.content}
                        domain={domain}
                      />
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="flex-grow mt-10"></div>
      <CreateYourOwnButton />
    </div>
  );
};
