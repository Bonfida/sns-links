const Footer = () => {
  return (
    <footer className="flex flex-col md:items-center items-start justify-center w-screen p-4 pt-10">
      <div className="flex md:flex-row flex-col items-center justify-center space-x-4 flex-wrap">
        <a
          className="text-xs text-white md:text-base"
          href="https://www.sns.id/listings"
          target="_blank"
        >
          Browse Domains
        </a>
        <a
          className="text-xs text-white md:text-base"
          href="https://www.sns.id/listings"
          target="_blank"
        >
          Learn
        </a>
        <a
          className="text-xs text-white md:text-base"
          href="https://sns.guide/"
          target="_blank"
        >
          Developers
        </a>
        <a
          className="text-xs text-white md:text-base"
          href="https://www.sns.id/community"
          target="_blank"
        >
          Community
        </a>
        <a
          className="text-xs text-white md:text-base"
          href="https://www.bonfida.org/blog"
          target="_blank"
        >
          Blog
        </a>
        <a
          className="text-xs text-white md:text-base"
          href="https://immunefi.com/bounty/bonfida/"
          target="_blank"
        >
          Bug Bounty
        </a>
      </div>
      <span className="text-xs text-white md:text-base">
        Powered by{" "}
        <a className="underline font-azeret" href="https://bonfida.org/">
          Bonfida
        </a>{" "}
        with ❤️
      </span>
    </footer>
  );
};

export default Footer;
