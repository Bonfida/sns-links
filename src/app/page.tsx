'use client';
const endpoint = process.env.NEXT_PUBLIC_ENDPOINT;
import { useEffect, useContext } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import DomainsOwnedContext from '../context/domainsOwned';
import { useRouter } from 'next/navigation';

export default function MyApp() {
  const { connected } = useWallet();
  const { domainsOwned } = useContext(DomainsOwnedContext);
  const router = useRouter();

  useEffect(() => {
    if (domainsOwned.length === 0) {
      router.push('login-page');
    }
  }, [connected]);

  return null;
}
