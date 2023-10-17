"use client";
import { useEffect, useContext } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import NotFoundModal from "../../components/NotFoundModal";
import Header from "../../components/Header";
import { useRouter } from "next/navigation";
import DomainsOwnedContext from "../../context/domainsOwned";
import { useFetchDomains } from "@/hooks/useFetchDomains";
import { useAllDomains } from "@/hooks/testingHook";
import "@solana/wallet-adapter-react-ui/styles.css";
import { getAllDomains, reverseLookupBatch } from "@bonfida/spl-name-service";
import { useDomainsForOwner } from "@bonfida/sns-react";
import { PublicKey } from "@solana/web3.js";

const LoginPage = () => {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const { domainsOwned, setDomainsOwned } = useContext(DomainsOwnedContext);
  const router = useRouter();
  const { domains } = useFetchDomains(connection, publicKey);
  const { testDomains } = useAllDomains(publicKey);

  useEffect(() => {
    if (connected) {
      const allDomains = getAllDomains(connection, publicKey);
    }
  }, [connected]);

  useEffect(() => {
    if (domains) {
      setDomainsOwned(domains);
    }
  }, [domains]);

  useEffect(() => {
    if (connected && domainsOwned.length !== 0) {
      router.push("domain-select");
    }
  }, [domainsOwned.length]);
  return (
    <>
      <Header />
      <div className="flex flex-col items-center h-screen mt-20 md:mt-0">
        <div className="flex flex-col items-center justify-center space-y-5">
          <h1 className="text-5xl md:text-8xl text-white text-center font-azeret font-bold ">
            <span className="block">Your links</span>
            <span className="block">on chain.</span>
          </h1>
          <div className=" flex items-center md:w-1/2 flex-col space-y-5">
            {domains && domainsOwned.length === 0 ? <NotFoundModal /> : null}
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
