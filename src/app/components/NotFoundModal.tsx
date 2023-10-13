const NotFoundModal = () => {
  return (
    <div className="bg-bds-dark-blues-DB900 items-center justify-center rounded-[24px] border-[1px] border-bds-dark-blues-DB600 max-w-[400px] flex flex-col px-10 py-10 space-y-5">
      <h1 className="text-white font-azeret text-center">
        Oops! Looks like the wallet you have connected does not contain any .sol
        domains. Please try connecting with another wallet address.
      </h1>
      <a href="https://www.sns.id/" target="_blank">
        <button className="px-3 py-2 text-white bg-blue-600 rounded-lg font-azeret">
          Purchase domain
        </button>
      </a>
    </div>
  );
};

export default NotFoundModal;
