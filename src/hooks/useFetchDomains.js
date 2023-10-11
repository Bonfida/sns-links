// import { useState, useCallback } from 'react';
// import { useConnection } from '@solana/wallet-adapter-react';
// import { useWallet } from '@solana/wallet-adapter-react';
// import { useDomainsForOwner } from '@bonfida/sns-react';

// export function useFetchDomains() {
//   const { connection } = useConnection();
//   const { publicKey, connected } = useWallet();
//   const [domains, setDomains] = useState([]);
//   const [error, setError] = useState(null);
//   const domainsResponse = useDomainsForOwner(connection, publicKey);

//   const fetchDomains = useCallback(() => {
//     console.log(domainsResponse);
//     if (connected && domainsResponse.loading) {
//       domainsResponse.currentPromise
//         .then((domains) => {
//           setDomains(domains);
//           console.log('domains', domains);
//         })
//         .catch((error) => setError(error));
//     }
//   }, [connected, publicKey, connection]);

//   return { domains, error, fetchDomains };
// }
