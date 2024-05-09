"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  {
    title: "Browse Domains",
    link: "https://www.sns.id/listings",
  },
  {
    title: "Learn",
    link: "https://docs.bonfida.org/collection/an-introduction-to-the-solana-name-service",
  },
  {
    title: "Developers",
    link: "https://sns.guide/",
  },
  { title: "Community", link: "https://www.sns.id/community" },
  { title: "Blog", link: "https://www.bonfida.org/blog" },
  { title: "Bug Bounty", link: "https://immunefi.com/bounty/bonfida/" },
];

const Footer = () => {
  const { theme } = useTheme();

  return (
    <footer className="bg-primary-bg flex items-center justify-center w-screen md:h-[72px] pt-5 sm:pt-0">
      <div className="flex sm:flex-row flex-col items-center md:justify-between justify-center w-full lg:w-[1224px] z-50 px-3 gap-y-6">
        <Link
          href="/"
          className="flex items-center justify-center sm:gap-4 gap-2 md:w-[149px] w-[100px]"
        >
          <Image
            width={80}
            height={80}
            src={
              theme === "dark"
                ? "/bonfida/bonfida-white.svg"
                : "/bonfida/bonfida-black.svg"
            }
            className="md:w-5 md:h-6"
            alt="SNS Links Logo"
          />

          <span className="text-base items-center font-bold text-primary-text lg:text-2xl">
            SNS Links
          </span>
        </Link>
        <div className="flex sm:flex-row flex-col items-center gap-2 sm:gap-3 lg:gap-8">
          {footerLinks.map((link) => {
            return (
              <Link
                className="text-primary-text lg:text-base text-sm font-bold font-azeret"
                href={link.link}
                target="_blanks"
                key={link.title}
              >
                {link.title}
              </Link>
            );
          })}
        </div>
        <span className="text-primary-text lg:text-base text-sm font-bold font-azeret flex flex-wrap w-[237px] gap-1 justify-center">
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
