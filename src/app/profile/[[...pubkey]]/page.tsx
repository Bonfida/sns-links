"use client";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import SelectedDomainContext from "@/context/selectedDomain";
import { useFetchDomains } from "@/hooks/useFetchDomains";
import NotFoundModal from "../../components/NotFoundModal";
import DomainCard from "../../components/DomainCard";
import ProfileOverview from "../../components/ProfileOverview";
import NotConnectedModal from "../../components/NotConnectedModal";
import Loading from "../../components/Loading";
import DomainTable from "@/app/components/DomainTable";
import Skeleton from "react-loading-skeleton";
import DomainTableSkeleton from "@/app/components/Skeleton/DomainTableSkeleton";
import ProfileOverviewSkeleton from "@/app/components/Skeleton/ProfileOverviewSkeleton";

const ProfilePage = () => {
  const router = useRouter();
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();
  const { setSelectedDomain } = useContext(SelectedDomainContext);
  const { data: domainsOwned, isLoading: domainsLoading } = useFetchDomains(
    connection,
    publicKey
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
    <div className="flex items-start justify-center w-full min-h-screen mt-10">
      {!connected && <NotConnectedModal />}
      {connected && domainsLoading && (
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
      {connected && !domainsLoading && (
        <>
          {domainsOwned?.length !== 0 ? (
            <div className="flex flex-col items-center justify-center">
              <div className="w-full">
                <ProfileOverview />
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

export default ProfilePage;
