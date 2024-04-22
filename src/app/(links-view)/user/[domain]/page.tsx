import LinkSharePageComponent from "@/app/components/Pages/LinkSharePage";
import { LinkShareParams } from "@/app/types/LinkShareParams";

export const metadata = {
  title: "Links",
  description: "Check out my links!",
};

const LinkSharePage = ({ params }: { params: LinkShareParams }) => {
  return (
    <div>
      <LinkSharePageComponent params={params} />
    </div>
  );
};

export default LinkSharePage;
