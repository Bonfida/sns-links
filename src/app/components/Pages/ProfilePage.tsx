"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import SelectedDomainContext from "@/context/selectedDomain";
import { useFetchDomains } from "@/hooks/useFetchDomains";
import NotFoundModal from "../Modals/NoLinksFoundModal";
import ProfileOverview from "../ProfileOverview/ProfileOverview";
import NotConnectedModal from "../Modals/NotConnectedModal";
import DomainList from "@/app/components/DomainList/DomainList";
import DomainTableSkeleton from "../Skeletons/DomainTableSkeleton";
import ProfileOverviewSkeleton from "../Skeletons/ProfileOverviewSkeleton";
import { useFetchRecords } from "@/hooks/useFetchRecords";
import { useFavouriteDomain } from "@/hooks/useFetchFavoriteDomain";
import { NotFoundNotice } from "../Modals/NotFoundNotice";

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
  const { data: favoriteDomain, loading: favoriteLoading } = useFavouriteDomain(
    publicKey?.toBase58()!
  );

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
        <div className="flex flex-col items-center justify-center">
          {domainsOwned?.length !== 0 ? (
            <>
              <ProfileOverview />
              <DomainList />
            </>
          ) : (
            <div>
              <NotFoundNotice />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePageComponent;
