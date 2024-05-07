import {
  verifyRightOfAssociation,
  Record,
  getRecordV2,
} from "@bonfida/spl-name-service";
import { Connection } from "@solana/web3.js";
import { useQuery, UseQueryResult } from "react-query";

export const useFetchVerifyROA = (
  connection: Connection,
  domain: string,
  name: Record
): UseQueryResult<boolean | undefined> => {
  const fetchROA = async (): Promise<boolean | undefined> => {
    if (!connection || !domain) {
      return undefined;
    }

    const { retrievedRecord } = await getRecordV2(connection, domain, name);

    try {
      const ROA = await verifyRightOfAssociation(
        connection,
        name,
        domain,
        retrievedRecord.getContent()
      );
      return ROA;
    } catch (error) {
      return undefined;
    }
  };

  return useQuery<boolean | undefined>({
    queryKey: ["ROA", name],
    queryFn: fetchROA,
  });
};
