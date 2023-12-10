"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useFetchDomains } from "@/hooks/useFetchDomains";

export default function MyApp() {
  const router = useRouter();
  const { connection } = useConnection();
  const { connected, publicKey } = useWallet();

  return (
    <section className="flex justify-center w-full min-h-screen py-12 ">
      <div className="container px-4 md:px-6 ">
        <div className="grid items-center gap-6 ">
          <div className="flex flex-col justify-center space-y-8 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter text-transparent sm:text-5xl xl:text-6xl/none bg-clip-text bg-gradient-to-r from-white to-gray-500">
                Your links on chain.
              </h1>
              <p className="max-w-[600px] text-zinc-200 md:text-xl dark:text-zinc-100 mx-auto">
                Upload all of your platform links using SNS links and share
                easily with friends. Your .sol domain now holds the key to
                sharing your brand accross the web.
              </p>
            </div>
            <div className="w-full max-w-full mx-auto space-y-4">
              <div className="grid grid-cols-3 gap-8">
                <div className="flex flex-col items-center p-4 space-y-2 border-gray-800 rounded-lg">
                  <div className="p-2 bg-black bg-opacity-50 rounded-full">
                    <IconInbox className="w-6 h-6 mb-2 text-white opacity-75" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Brand</h2>
                  <p className="text-zinc-200 dark:text-zinc-100">
                    Your on chain identity
                  </p>
                </div>
                <div className="flex flex-col items-center p-4 space-y-2 border-gray-800 rounded-lg">
                  <div className="p-2 bg-black bg-opacity-50 rounded-full">
                    <IconIntegration className="w-6 h-6 mb-2 text-white opacity-75" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Share</h2>
                  <p className="text-zinc-200 dark:text-zinc-100">
                    Share all your links with ease
                  </p>
                </div>
                <div className="flex flex-col items-center p-4 space-y-2 border-gray-800 rounded-lg">
                  <div className="p-2 bg-black bg-opacity-50 rounded-full">
                    <IconCustomization className="w-6 h-6 mb-2 text-white opacity-75" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Verify</h2>
                  <p className="text-zinc-200 dark:text-zinc-100">
                    Peace of mind with verified links
                  </p>
                </div>
                <div className="flex flex-col items-center p-4 space-y-2 border-gray-800 rounded-lg">
                  <div className="p-2 bg-black bg-opacity-50 rounded-full">
                    <IconSearch className="w-6 h-6 mb-2 text-white opacity-75" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Standout</h2>
                  <p className="text-zinc-200 dark:text-zinc-100">
                    Set up a profile that stands out
                  </p>
                </div>
                <div className="flex flex-col items-center p-4 space-y-2 border-gray-800 rounded-lg">
                  <div className="p-2 bg-black bg-opacity-50 rounded-full">
                    <IconSecurity className="w-6 h-6 mb-2 text-white opacity-75" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Integrate</h2>
                  <p className="text-zinc-200 dark:text-zinc-100">BINGBONG</p>
                </div>
                <div className="flex flex-col items-center p-4 space-y-2 border-gray-800 rounded-lg">
                  <div className="p-2 bg-black bg-opacity-50 rounded-full">
                    <IconCollaboration className="w-6 h-6 mb-2 text-white opacity-75" />
                  </div>
                  <h2 className="text-xl font-bold text-white">OPOS</h2>
                  <p className="text-zinc-200 dark:text-zinc-100">
                    Made easy thanks to Solana
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function IconCollaboration(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 6 4-4 4 4" />
      <path d="M12 2v10.3a4 4 0 0 1-1.172 2.872L4 22" />
      <path d="m20 22-5-5" />
    </svg>
  );
}

function IconCustomization(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconInbox(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}

function IconIntegration(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 6 4-4 4 4" />
      <path d="M12 2v10.3a4 4 0 0 1-1.172 2.872L4 22" />
      <path d="m20 22-5-5" />
    </svg>
  );
}

function IconSearch(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function IconSecurity(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
