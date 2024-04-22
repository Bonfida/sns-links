import "@bonfida/sns-widget/style.css";

const NotConnectedModal = () => {
  return (
    <div className="bg-bds-dark-blues-DB900 items-center justify-center rounded-[24px] border-[1px] border-bds-dark-blues-DB600 max-w-[400px] flex flex-col px-10 py-10 space-y-5 h-[250px]">
      <h2 className="text-xl font-semibold text-center text-white font-azere">
        Connect your wallet to continue
      </h2>
    </div>
  );
};

export default NotConnectedModal;
