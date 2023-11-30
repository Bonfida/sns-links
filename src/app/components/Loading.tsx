import { SpinnerFida } from "@bonfida/components";
import "@bonfida/sns-widget/style.css";
const endpoint = process.env.NEXT_PUBLIC_ENDPOINT;
const Loading = () => {
  return (
    <div className="bg-bds-dark-blues-DB900 items-center justify-center rounded-[24px] border-[1px] border-bds-dark-blues-DB600 h-[250px] w-[400px] px-10 py-10 flex">
      <SpinnerFida variant="white" className="animate-spin-speed" />
    </div>
  );
};

export default Loading;
