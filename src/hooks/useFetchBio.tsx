import { NameRegistryState } from "@bonfida/spl-name-service";
import { useDomainsInfoV2 } from "./useDomainsInfo";
import { useQuery, UseQueryResult } from "react-query";

export const useFetchBio = (
  domain: string
): UseQueryResult<string | undefined> => {
  const { data: domainInfo, isLoading } = useDomainsInfoV2([domain]);
  const fetchBio = (): string | undefined => {
    const registry =
      domainInfo?.[0]?.data && !isLoading
        ? NameRegistryState.deserialize(domainInfo?.[0]?.data)
        : undefined;
    const content: string | undefined = registry?.data
      ?.toString()
      .trimStart()
      .trimEnd();

    // We want to make sure the content doesn't only include null characters.
    if (content && !/^[\0]*$/.test(content)) {
      return content;
    }
    return undefined;
  };

  return useQuery<string | undefined>({
    queryKey: ["bio", domain],
    queryFn: fetchBio,
    // We only want the query to run when domain info is finsished loading
    enabled: !isLoading && domainInfo !== undefined,
  });
};
