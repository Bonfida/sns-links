import CreateYourOwnButton from "@/app/components/Buttons/CreateYourOwn";
import { UserLinksListPage } from "@/app/components/Pages/UserLinksListPage";

export const metadata = {
  title: "Links",
  description: "Check out my links!",
};

export type LinkShareParams = {
  domain: string;
};

const LinkShareView = ({ params }: { params: LinkShareParams }) => {
  return (
    <div className="w-screen min-h-screen bg-primary-bg mt-[50px]">
      <UserLinksListPage params={params} />
      <div className="flex justify-center my-10">
        <CreateYourOwnButton />
      </div>
    </div>
  );
};

export default LinkShareView;
