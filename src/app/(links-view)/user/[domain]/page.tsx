import { LinkSharePage } from "@/app/components/Pages/LinkSharePage";
import { LinkShareParams } from "@/app/types/LinkShareParams";

export const metadata = {
  title: "Links",
  description: "Check out my links!",
};

const LinkShareView = ({ params }: { params: LinkShareParams }) => {
  return (
    <div>
      <LinkSharePage params={params} />
    </div>
  );
};

export default LinkShareView;
