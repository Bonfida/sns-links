import Image from "next/image";
import Link from "next/link";
const Footer = () => {
  return (
    <footer className="flex justify-center w-screen h-[72px] bg-footer-bg items-center">
      <div className="flex items-center justify-center w-[1224px]">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center justify-center sm:gap-4 gap-2"
          >
            <Image
              width={80}
              height={80}
              src="/bonfida/bonfida-white.svg"
              className="w-5 h-6"
              alt="SNS Links Logo"
            />

            <span className="text-base items-center font-bold text-topbar-text sm:text-2xl">
              SNS Links
            </span>
          </Link>
          <div className="flex justify-between">
            <Link
              className="text-xs text-white md:text-base"
              href="https://www.sns.id/listings"
              target="_blank"
            >
              Browse Domains
            </Link>
            <Link
              className="text-xs text-white md:text-base"
              href="https://www.sns.id/listings"
              target="_blank"
            >
              Learn
            </Link>
            <Link
              className="text-xs text-white md:text-base"
              href="https://sns.guide/"
              target="_blank"
            >
              Developers
            </Link>
            <Link
              className="text-xs text-white md:text-base"
              href="https://www.sns.id/community"
              target="_blank"
            >
              Community
            </Link>
            <Link
              className="text-xs text-white md:text-base"
              href="https://www.bonfida.org/blog"
              target="_blank"
            >
              Blog
            </Link>
            <Link
              className="text-xs text-white md:text-base"
              href="https://immunefi.com/bounty/bonfida/"
              target="_blank"
            >
              Bug Bounty
            </Link>
            <span className="text-xs text-white md:text-base">
              Powered by{" "}
              <Link
                className="underline font-azeret"
                href="https://bonfida.org/"
              >
                Bonfida
              </Link>{" "}
              with ❤️
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
