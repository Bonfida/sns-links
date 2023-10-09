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

const LoginPage = () => {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();

  return (
    <div className="flex justify-center align-middle items-center h-screen">
      {connected ? <WalletDisconnectButton /> : <WalletMultiButton />}
    </div>
  );
};

export default LoginPage;
