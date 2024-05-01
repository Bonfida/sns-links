"use client";
import ThemeContext from "@/context/theme";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
const Footer = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <footer className="bg-primary-bg flex items-center justify-center w-screen md:h-[72px] pt-5 sm:pt-0">
      <div className="flex sm:flex-row flex-col items-center md:justify-between justify-center w-full md:w-[1224px] z-50 px-3 gap-y-6">
        <Link
          href="/"
          className="flex items-center justify-center sm:gap-4 gap-2 w-[149px]"
        >
          <Image
            width={80}
            height={80}
            src={
              theme === "dark"
                ? "/bonfida/bonfida-white.svg"
                : "/bonfida/bonfida-black.svg"
            }
            className="w-5 h-6"
            alt="SNS Links Logo"
          />

          <span className="text-base items-center font-bold text-primary-text sm:text-2xl">
            SNS Links
          </span>
        </Link>
        <div className="flex md:flex-row flex-col items-center gap-6 md:gap-8">
          <Link
            className="text-primary-text md:text-base text-sm font-bold font-azeret "
            href="https://www.sns.id/listings"
            target="_blank"
          >
            Browse Domains
          </Link>
          <Link
            className="text-primary-text md:text-base text-sm font-bold font-azeret"
            href="https://www.sns.id/listings"
            target="_blank"
          >
            Learn
          </Link>
          <Link
            className="text-primary-text md:text-base text-sm font-bold font-azeret"
            href="https://sns.guide/"
            target="_blank"
          >
            Developers
          </Link>
          <Link
            className="text-primary-text md:text-base text-sm font-bold font-azeret"
            href="https://www.sns.id/community"
            target="_blank"
          >
            Community
          </Link>
          <Link
            className="text-primary-text md:text-base text-sm font-bold font-azeret"
            href="https://www.bonfida.org/blog"
            target="_blank"
          >
            Blog
          </Link>
          <Link
            className="text-primary-text md:text-base text-sm font-bold font-azeret"
            href="https://immunefi.com/bounty/bonfida/"
            target="_blank"
          >
            Bug Bounty
          </Link>
        </div>
        <span className="text-primary-text md:text-base text-sm font-bold font-azeret flex flex-wrap w-[237px] gap-1 justify-center">
          Powered by{" "}
          <Link className="font-azeret text-link" href="https://bonfida.org/">
            Bonfida
          </Link>{" "}
          with ❤️
        </span>
      </div>
    </footer>
  );
};

export default Footer;
