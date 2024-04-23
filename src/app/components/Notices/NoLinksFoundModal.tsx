import "@bonfida/sns-widget/style.css";

export const NoLinksFoundNotice = () => {
  return (
    <div className="items-center justify-center rounded-[24px] border-[1px] border-bds-dark-blues-DB600 max-w-[400px] flex flex-col px-10 py-10 space-y-5 h-[250px]">
      <h2 className="text-xl font-semibold text-center text-white font-azere">
        {`No links found! Are you sure you're in the right place?`}
      </h2>
    </div>
  );
};
