import LinkSharePageComponent from "@/app/components/Pages/LinkSharePageComponent";
import { LinkShareParams } from "@/app/types/LinkShareParams";

const LinkSharePage = ({ params }: { params: LinkShareParams }) => {
  return (
    <div>
      <LinkSharePageComponent params={params} />
    </div>
  );
};

export default LinkSharePage;
