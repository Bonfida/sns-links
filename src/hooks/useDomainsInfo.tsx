import { useQuery } from "react-query";
import { derive } from "../utils/derive";
import { NameRegistryState } from "@bonfida/spl-name-service";
import { AccountInfo, PublicKey } from "@solana/web3.js";
import { useMultipleAccountInfoWs } from "./useMultipleAccountInfoWs";

// Assuming the derive function might return complex objects, define a result interface
interface DeriveResult {
  isSub: boolean;
  parent?: PublicKey; // Make 'parent' optional or '| undefined'
  pubkey: PublicKey;
  hashed: Buffer;
  isSubRecord?: boolean; // Include other properties as necessary
}

// Callback to deserialize data for NameRegistryState
const callBack = (info: AccountInfo<Buffer>) => {
  return NameRegistryState.deserialize(info.data);
};

// Function to fetch domain keys from the domain names
const fetchDomainKeys = async (
  domains: string[] | undefined | null
): Promise<{ pubkey: PublicKey; domain: string }[]> => {
  if (!domains || domains.length === 0) return [];
  const derivedResults: DeriveResult[] = await Promise.all(
    domains.map((domain) => derive(domain))
  );
  return derivedResults.map((result, idx) => ({
    pubkey: result.pubkey, // Extracting the PublicKey directly
    domain: domains[idx],
  }));
};

// Hook to use domain information
export const useDomainsInfo = (domains: string[] | undefined | null) => {
  const queryKey = ["domainsInfo", { domains }];

  const {
    data: keys,
    isLoading,
    error,
  } = useQuery<{ pubkey: PublicKey; domain: string }[]>(
    queryKey,
    () => fetchDomainKeys(domains),
    {
      enabled: !!domains && domains.length > 0,
    }
  );

  const accountInfo = useMultipleAccountInfoWs(
    keys?.map((k) => k.pubkey) || [],
    callBack
  );

  return { data: accountInfo, keys, isLoading, error };
};
