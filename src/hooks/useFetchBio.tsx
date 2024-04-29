import { useDomainsInfo } from "./useDomainsInfo";
import { useQuery, UseQueryResult } from "react-query";

export const useFetchBio = (domain: string): UseQueryResult<string> => {
  const { data: domainInfo, keys } = useDomainsInfo([domain]);
  const domainKey = keys?.find((e) => e.domain === domain)?.pubkey;
  const fetchBio = async (): Promise<string> => {
    const content: string | undefined =
      domainKey &&
      domainInfo
        ?.get(domainKey.toBase58())
        ?.data?.toString()
        .trimStart()
        .trimEnd();

    if (content && !/^[\0]*$/.test(content)) {
      return content;
    }

    return "";
  };

  return useQuery<string>({
    queryKey: ["bio", domain],
    queryFn: fetchBio,
  });
};
