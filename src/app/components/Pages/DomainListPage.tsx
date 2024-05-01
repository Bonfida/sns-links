"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useFetchDomains } from "@/hooks/useFetchDomains";
import ProfileOverview from "../ProfileOverview/ProfileOverview";
import NotConnectedModal from "../Modals/NotConnectedModal";
import DomainList from "@/app/components/DomainList/DomainList";
import DomainTableSkeleton from "../Skeletons/DomainListSkeleton";
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
  const { isLoading: domainsLoading, data: domainsOwned } = useFetchDomains(
    connection,
    publicKey
  );
  const { loading: favoriteLoading } = useFavouriteDomain(
    publicKey?.toBase58()!
  );

  const loading = domainsLoading || favoriteLoading;

  useEffect(() => {
    if (!publicKey) {
      router.push(`/profile`);
    } else {
      router.push(`/profile/${publicKey}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey]);

  return (
    <div className="flex flex-col w-full h-full items-center">
      {loading ? (
        <>
          <div className="md:w-[800px] sm:w-[450px] w-screen">
            <ProfileOverviewSkeleton />
          </div>
          <DomainTableSkeleton />
        </>
      ) : domainsOwned && domainsOwned?.length > 0 ? (
        <>
          <div className="md:w-[800px] sm:w-[450px] w-screen">
            <ProfileOverview />
          </div>
          <DomainList />
        </>
      ) : (
        <NoDomainsFound />
      )}
    </div>
  );
};
