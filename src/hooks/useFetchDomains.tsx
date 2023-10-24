import { getAllDomains, reverseLookupBatch } from "@bonfida/spl-name-service";
import { useQuery } from "react-query";

export const useFetchDomains = (connection, owner) => {
  const fetchDomains = async () => {
    const serializedDomainArr = await getAllDomains(connection, owner);
    return await reverseLookupBatch(connection, serializedDomainArr);
  };

  return useQuery({
    queryKey: ["domains", owner],
    queryFn: fetchDomains,
  });
};
