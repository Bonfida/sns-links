import Topbar from "@/app/components/Navigation/Topbar";
import { LinkSharePage } from "@/app/components/Pages/LinkSharePage";
import { LinkShareParams } from "@/app/types/LinkShareParams";

export const metadata = {
  title: "Links",
  description: "Check out my links!",
};

const LinkShareView = ({ params }: { params: LinkShareParams }) => {
  return (
    <div className="w-screen h-screen bg-primary-bg">
      <LinkSharePage params={params} />
    </div>
  );
};

export default LinkShareView;
