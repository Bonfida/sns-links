import { UserLinksListPage } from "@/app/components/Pages/UserLinksListPage";
import { LinkShareParams } from "@/app/types/LinkShareParams";

export const metadata = {
  title: "Links",
  description: "Check out my links!",
};

const LinkShareView = ({ params }: { params: LinkShareParams }) => {
  return (
    <div className="w-screen h-screen bg-primary-bg">
      <UserLinksListPage params={params} />
    </div>
  );
};

export default LinkShareView;
