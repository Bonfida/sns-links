"use client";
import { useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import NotFoundModal from "../components/NotFoundModal";
import Header from "../components/Topbar";
import { useFetchDomains } from "@/hooks/useFetchDomains";
import Footer from "../components/Footer";
import { useFetchTokenizedDomains } from "@/hooks/useFetchTokenizedDomains";

const LoginPage = () => {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const router = useRouter();
  const { data: domainsOwned, isLoading: domainsLoading } = useFetchDomains(
    connection,
    publicKey
  );
  const { data: tokenizedDomainsOwned, isLoading: tokenizedDomainsLoading } =
    useFetchTokenizedDomains(connection, publicKey);

  useEffect(() => {
    if (connected && !domainsLoading && !tokenizedDomainsLoading) {
      if (domainsOwned?.length !== 0 || tokenizedDomainsOwned?.length !== 0) {
        router.push("domain-select");
      }
    }
  }, [
    connected,
    domainsLoading,
    tokenizedDomainsLoading,
    domainsOwned,
    tokenizedDomainsOwned,
    router,
  ]);

  return (
    <>
      <div className="flex flex-col items-center h-screen mt-20 mb-10 md:mt-0">
        <div className="flex flex-col items-center justify-center space-y-5">
          <h1 className="text-5xl font-bold text-center text-white md:text-8xl font-azeret ">
            <span className="block">Your links</span>
            <span className="block">on chain.</span>
          </h1>
          <div className="flex flex-col items-center space-y-5  md:w-1/2">
            {connected &&
              ((!domainsLoading && domainsOwned?.length === 0) ||
                (!tokenizedDomainsLoading &&
                  tokenizedDomainsOwned?.length === 0)) && <NotFoundModal />}
            <h1 className="text-[#CECED8] text-center font-azeret md:text-[24px] text-[16px]">
              Upload all of your platform links using SNS links and share easily
              with friends. Your .sol domain now holds the key to sharing your
              brand accross the web.
            </h1>
            {!connected ? <WalletMultiButton /> : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
