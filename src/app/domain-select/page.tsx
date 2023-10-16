'use client';
import DomainSelectButton from '../../components/DomainSelectButton';
import Header from '../../components/Header';
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DomainsOwnedContext from '../../context/domainsOwned';
import { useWallet } from '@solana/wallet-adapter-react';

const DomainSelectPage = () => {
  const { connected } = useWallet();
  const { domainsOwned, setDomainsOwned } = useContext(DomainsOwnedContext);
  const router = useRouter();

  useEffect(() => {
    if (!connected || domainsOwned.length === 0) {
      setDomainsOwned([]);
      router.push('login-page');
    }
  }, [connected]);

  return (
    <>
      <Header />
      <div className=" h-screen w-full flex items-center justify-start flex-col md:mt-0 mt-20 ">
        <h1 className="text-xl font-bold text-white font-azeret text-center  md:mt-0 ">
          Which domain's links would you like to view?
        </h1>
        <ul className="space-y-10">
          {domainsOwned.map((domain) => {
            return <DomainSelectButton domain={domain} key={domain} />;
          })}
        </ul>
      </div>
    </>
  );
};

export default DomainSelectPage;
