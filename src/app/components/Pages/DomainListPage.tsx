"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useFetchDomains } from "@/hooks/useFetchDomains";
import ProfileOverview from "../ProfileOverview/ProfileOverview";
import NotConnectedModal from "../Modals/NotConnectedModal";
import DomainList from "@/app/components/DomainList/DomainList";
import DomainTableSkeleton from "../Skeletons/DomainTableSkeleton";
import ProfileOverviewSkeleton from "../Skeletons/ProfileOverviewSkeleton";
import { useFavouriteDomain } from "@/hooks/useFetchFavoriteDomain";
import { NoDomainsFound } from "../Notices/NoDomainsFound";

export const metadata = {
  title: "Profile Page",
};

export const DomainListPage = () => {
  const router = useRouter();
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();
  const { data: domainsOwned, isLoading: domainsLoading } = useFetchDomains(
    connection,
    publicKey
  );
  const { data: favoriteDomain, loading: favoriteLoading } = useFavouriteDomain(
    publicKey?.toBase58()!
  );

  useEffect(() => {
    if (!publicKey) {
      router.push(`/profile`);
    } else {
      router.push(`/profile/${publicKey}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey]);

  return (
    <div className="flex w-full h-full justify-center">
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
        <div className="flex flex-col ">
          {domainsOwned?.length !== 0 ? (
            <>
              <div className="flex items-start">
                <ProfileOverview />
              </div>
              <div className="flex items-center ">
                <DomainList />
              </div>
            </>
          ) : (
            <div>
              <NoDomainsFound />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
