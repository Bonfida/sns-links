"use client";
const endpoint = process.env.NEXT_PUBLIC_ENDPOINT;
import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useFetchDomains } from "@/hooks/useFetchDomains";
import { useRouter } from "next/navigation";

export default function MyApp() {
  const { connected } = useWallet();
  const router = useRouter();
  const { data: domainsData, isLoading: domainsLoading } = useFetchDomains(
    connection,
    publicKey
  );

  useEffect(() => {
    if (domainsData.length === 0) {
      router.push("login-page");
    }
  }, [connected]);

  return null;
}
