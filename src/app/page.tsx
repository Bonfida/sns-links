'use client';
const endpoint = process.env.NEXT_PUBLIC_ENDPOINT;
import { useEffect, useContext } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import DomainsOwnedContext from '../context/domainsOwned';
import { useRouter } from 'next/navigation';
import { getAllDomainsTest } from '../hooks/testingHook';

export default function MyApp() {
  const { connection } = useConnection();
  const { connected, publicKey } = useWallet();
  const { domainsOwned } = useContext(DomainsOwnedContext);
  // const testingNames = getAllDomainsTest(connection, publicKey);
  const router = useRouter();

  useEffect(() => {
    // console.log('testing names', testingNames);
    if (domainsOwned.length === 0) {
      router.push('login-page');
    }
  }, [connected]);

  return null;
}
