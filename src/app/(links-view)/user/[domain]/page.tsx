import { UserLinksListPage } from "@/app/components/Pages/UserLinksListPage";
import { LinkShareParams } from "@/app/types/LinkShareParams";

export const metadata = {
  title: "Links",
  description: "Check out my links!",
};

const LinkShareView = ({ params }: { params: LinkShareParams }) => {
  return (
    <div className="w-screen min-h-screen bg-primary-bg mt-[50px]">
      <UserLinksListPage params={params} />
    </div>
  );
};

export default LinkShareView;
