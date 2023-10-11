import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from './Components/Header.tsx';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SNS Links',
  description: 'All your web3 links under one roof',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#03001A]">
        {<Header />}
        {children}
      </body>
    </html>
  );
}
