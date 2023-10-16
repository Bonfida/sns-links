import { useState, useEffect, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { getAllDomains, reverseLookupBatch } from '@bonfida/spl-name-service';

export function useFetchDomains(connection, owner) {
  const { connected } = useWallet();
  const [domains, setDomains] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mounted = useRef(true);

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        setLoading(true);
        const serializedDomainArr = await getAllDomains(connection, owner);
        const names = await reverseLookupBatch(connection, serializedDomainArr);
        if (mounted.current) {
          setDomains(names);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
      return () => (mounted.current = false);
    };
    if (connected) {
      fetchDomains();
    }
  }, [owner, connected, connection]);

  return { domains, loading, error };
}
