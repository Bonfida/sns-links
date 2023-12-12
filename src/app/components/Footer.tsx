import Link from "next/link";
const Footer = () => {
  return (
    <footer className="flex flex-col md:items-center items-start justify-center w-screen p-4 pt-10">
      <div className="flex md:flex-row flex-col items-center justify-center space-x-4 flex-wrap">
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
      </div>
      <span className="text-xs text-white md:text-base">
        Powered by{" "}
        <Link className="underline font-azeret" href="https://bonfida.org/">
          Bonfida
        </Link>{" "}
        with ❤️
      </span>
    </footer>
  );
};

export default Footer;
