"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import SelectedDomainContext from "@/context/selectedDomain";
import { useFetchDomains } from "@/hooks/useFetchDomains";
import NotFoundModal from "../NoLinksFoundModal";
import ProfileOverview from "../ProfileOverview";
import NotConnectedModal from "../NotConnectedModal";
import DomainTable from "@/app/components/DomainTable";
import DomainTableSkeleton from "@/app/components/Skeleton/DomainTableSkeleton";
import ProfileOverviewSkeleton from "@/app/components/Skeleton/ProfileOverviewSkeleton";
import { useFetchFavoriteDomain } from "@/hooks/useFetchFavoriteDomain";
import { useFetchRecords } from "@/hooks/useFetchRecords";

export const metadata = {
  title: "Profile Page",
};

const ProfilePageComponent = () => {
  const router = useRouter();
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();
  const { data: domainsOwned, isLoading: domainsLoading } = useFetchDomains(
    connection,
    publicKey
  );
  const { data: favoriteDomain, isLoading: favoriteLoading } =
    useFetchFavoriteDomain(connection, publicKey!);

  useEffect(() => {
    if (!publicKey) {
      router.push(`/profile`);
    } else {
      router.push(`/profile/${publicKey}`);
    }
  }, [publicKey]);

  return (
    <div className="flex items-start justify-center w-full min-h-screen mt-10">
      {!connected && <NotConnectedModal />}
      {connected && (favoriteLoading || domainsLoading) && (
        <>
          <div className="flex flex-col items-center justify-center">
            <div className="w-full">
              <ProfileOverviewSkeleton />
              <div className="">
                <DomainTableSkeleton />
              </div>
            </div>
          </div>
        </>
      )}
      {connected && !favoriteLoading && !domainsLoading && (
        <>
          {domainsOwned?.length !== 0 ? (
            <div className="flex flex-col items-center justify-center">
              <div className="w-full">
                <ProfileOverview
                  favoriteDomain={favoriteDomain}
                  favoriteLoading={favoriteLoading}
                  publicKey={publicKey!}
                />
                <div className="">
                  <DomainTable />
                </div>
              </div>
            </div>
          ) : (
            <NotFoundModal />
          )}
        </>
      )}
    </div>
  );
};

export default ProfilePageComponent;
