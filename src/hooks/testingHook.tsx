import { useState, useEffect } from "react";
import { PublicKey } from "@solana/web3.js";
import { reverseLookupBatch } from "@bonfida/spl-name-service";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

const ROOT_DOMAIN_ACCOUNT = new PublicKey(
  "58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx"
);

const NAME_PROGRAM_ID = new PublicKey(
  "namesLPneVptA9Z5rqUDD9tMTWEJwofgaYwp8cawRkX"
);

export function useAllDomains(wallet) {
  const [testDomains, setTestDomains] = useState([]);
  const [testLoading, setTestLoading] = useState(true);
  const [testError, setTestError] = useState(null);
  const { connection } = useConnection();

  useEffect(() => {
    async function fetchDomains() {
      try {
        const filters = [
          {
            memcmp: {
              offset: 32,
              bytes: wallet.toBase58(),
            },
          },
          {
            memcmp: {
              offset: 0,
              bytes: ROOT_DOMAIN_ACCOUNT.toBase58(),
            },
          },
        ];
        const accounts = await connection.getProgramAccounts(NAME_PROGRAM_ID, {
          filters,
        });
        const unserializedNameArr = [];
        accounts.map((a) => unserializedNameArr.push(a.pubkey));
        const names = await reverseLookupBatch(connection, unserializedNameArr);

        setTestDomains(names);
      } catch (e) {
        setTestError(e);
      } finally {
        setTestLoading(false);
      }
    }

    fetchDomains();
  }, [connection, wallet]);

  return { testDomains, testLoading, testError };
}
