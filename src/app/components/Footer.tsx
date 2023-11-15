const Footer = () => {
  return (
    <div className="w-full flex items-center justify-center bg-[#12152B] flex-col">
      <div className="md:h-18 h-12 flex md:flex-row flex-col items-center md:justify-center md:w-3/4 w-full space-x-4">
        <a
          className="text-white font-azeret"
          href="https://www.sns.id/listings"
        >
          Browse Domains
        </a>
        <a
          className="text-white font-azeret"
          href="https://www.sns.id/listings"
        >
          Learn
        </a>
        <a className="text-white font-azeret" href="https://sns.guide/">
          Developers
        </a>
        <a
          className="text-white font-azeret"
          href="https://www.sns.id/community"
        >
          Community
        </a>
        <a
          className="text-white font-azeret"
          href="https://www.bonfida.org/blog"
        >
          Blog
        </a>
        <a
          className="text-white font-azeret"
          href="https://immunefi.com/bounty/bonfida/"
        >
          Bug Bounty
        </a>
      </div>
      <h1 className="text-white font-azeret">
        Powered by{" "}
        <a className="underline font-azeret" href="https://bonfida.org/">
          Bonfida
        </a>{" "}
        with ❤️
      </h1>
    </div>
  );
};

export default Footer;
