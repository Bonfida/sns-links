import {
  verifyRightOfAssociation,
  Record,
  GUARDIANS,
  ETH_ROA_RECORDS,
  getRecordV2,
  getRecordV2Key,
} from "@bonfida/spl-name-service";
import { Connection, PublicKey } from "@solana/web3.js";
import { useQuery, UseQueryResult } from "react-query";
import { Record as SnsRecord } from "@bonfida/sns-records";

export const useFetchVerifyROA = (
  connection: Connection,
  domain: string,
  name: Record
): UseQueryResult<boolean | undefined> => {
  const fetchROA = async (): Promise<boolean | undefined> => {
    console.log("name", name);
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
      console.log("ROA", ROA);
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
