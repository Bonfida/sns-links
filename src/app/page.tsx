"use client";
const endpoint = process.env.NEXT_PUBLIC_ENDPOINT;
import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useFetchDomains } from "@/hooks/useFetchDomains";
import { useRouter } from "next/navigation";
import { useConnection } from "@solana/wallet-adapter-react";

export default function MyApp() {
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();
  const router = useRouter();

  // const { data: domainsData, isLoading: domainsLoading } = useFetchDomains(
  //   connection,
  //   publicKey
  // );

  useEffect(() => {
    router.push("login-page");
  }, []);
  return null;
}
