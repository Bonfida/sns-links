'use client';
import DomainSelectButton from '../../components/DomainSelectButton';
import Header from '../../components/Header';
import { useContext } from 'react';
import DomainsOwnedContext from '../../context/domainsOwned';

const DomainSelectPage = () => {
  const { domainsOwned } = useContext(DomainsOwnedContext);
  return (
    <>
      <Header />
      <div className=" h-screen w-3/4 flex items-center justify-start flex-col space-y-10 ">
        <h1 className="text-xl font-bold text-white font-azeret text-center mt-20 md:mt-0 ">
          Which domain's links would you like to view?
        </h1>
        <ul className="space-y-10">
          {domainsOwned.map((domain) => {
            return (
              <DomainSelectButton domain={domain.domain} key={domain.domain} />
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default DomainSelectPage;
