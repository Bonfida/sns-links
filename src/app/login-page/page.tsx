"use client";
import { useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import NotFoundModal from "../components/NotFoundModal";
import Header from "../components/Header";
import { useFetchDomains } from "@/hooks/useFetchDomains";
import Footer from "../components/Footer";
import { getDomainKeySync, NameRegistryState } from "@bonfida/spl-name-service";

const LoginPage = () => {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const router = useRouter();
  const { data, isLoading } = useFetchDomains(connection, publicKey);

  useEffect(() => {
    if (connected && !isLoading && data?.length !== 0) {
      router.push("domain-select");
    }
  }, [!isLoading, connected]);

  return (
    <>
      <Header />
      <div className="flex flex-col items-center h-screen mt-20 md:mt-0 mb-10">
        <div className="flex flex-col items-center justify-center space-y-5">
          <h1 className="text-5xl md:text-8xl text-white text-center font-azeret font-bold ">
            <span className="block">Your links</span>
            <span className="block">on chain.</span>
          </h1>
          <div className=" flex items-center md:w-1/2 flex-col space-y-5">
            {connected && data && data.length === 0 ? <NotFoundModal /> : null}
            <h1 className="text-[#CECED8] text-center font-azeret md:text-[24px] text-[16px]">
              Upload all of your platform links using SNS links and share easily
              with friends. Your .sol domain now holds the key to sharing your
              brand accross the web.
            </h1>
            {!connected ? <WalletMultiButton /> : null}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LoginPage;
