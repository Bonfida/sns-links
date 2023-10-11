import { useEffect, useState } from 'react';
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
  useConnection,
} from '@solana/wallet-adapter-react';
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import { getAllDomains } from '@bonfida/spl-name-service';
import { clusterApiUrl, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, AccountLayout } from '@solana/spl-token';
import { useDomainsForOwner } from '@bonfida/sns-react';
import { Buffer } from 'buffer';
import NotFoundModal from '../app/Components/NotFoundModal.tsx';
import DomainSelectPage from './DomainSelect.tsx';

const LoginPage = ({ domainsOwned, setDomainsOwned }) => {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const { result } = useDomainsForOwner(connection, publicKey);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (result) {
      setDomainsOwned(result);
      setLoggedIn(true);
    }
  }, [result, publicKey, loggedIn]);

  if (connected && domainsOwned.length !== 0) {
    return <DomainSelectPage loggedIn={loggedIn} domainsOwned={domainsOwned} />;
    console.log(domainsOwned);
  }

  return (
    <div className="flex flex-col items-center h-screen">
      <div className="flex flex-col items-center justify-center space-y-5">
        <h1 className="text-5xl md:text-8xl text-white text-center font-azeret font-bold ">
          <span className="block">Your links</span>
          <span className="block">on chain.</span>
        </h1>
        <div className=" flex items-center flex-col space-y-5">
          {result && domainsOwned.length === 0 ? <NotFoundModal /> : null}
          <h1 className="text-[#CECED8] md:text-center font-azeret md:text-[24px] text-[16px]">
            Upload all of your platform links using SNS links and share easily
            with friends. Your .sol domain now holds the key to sharing your
            brand accross the web.
          </h1>
          {connected ? <WalletDisconnectButton /> : <WalletMultiButton />}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
