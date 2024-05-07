import { useQuery } from "react-query";
import { derive } from "../utils/derive";
import { NameRegistryState } from "@bonfida/spl-name-service";
import { AccountInfo, PublicKey } from "@solana/web3.js";
import { useMultipleAccountInfoWs } from "./useMultipleAccountInfoWs";

interface DeriveResult {
  isSub: boolean;
  parent?: PublicKey;
  pubkey: PublicKey;
  hashed: Buffer;
  isSubRecord?: boolean;
}

const callBack = (info: AccountInfo<Buffer>) => {
  return NameRegistryState.deserialize(info.data);
};

const fetchDomainKeys = async (
  domains: string[] | undefined | null
): Promise<{ pubkey: PublicKey; domain: string }[]> => {
  if (!domains || domains.length === 0) return [];
  const derivedResults: DeriveResult[] = await Promise.all(
    domains.map((domain) => derive(domain))
  );
  return derivedResults.map((result, idx) => ({
    pubkey: result.pubkey,
    domain: domains[idx],
  }));
};

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
