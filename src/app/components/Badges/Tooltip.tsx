import Image from "next/image";
import { ReactNode } from "react";
const Badge = ({
  tooltipContent,
  imgSrc,
  sizeClass = "w-[16px]",
  icon,
}: {
  tooltipContent: ReactNode;
  imgSrc?: string;
  sizeClass?: string;
  icon?: ReactNode;
}) => {
  return (
    <div
      className="ml-3 tooltip hover:tooltip-open before:text-white before:bg-black after:border-t-black before:p-2"
      data-tip={tooltipContent}
    >
      {icon ?? (
        <Image
          className={sizeClass}
          src={imgSrc || "/public/verifications/verified-badge.svg"}
          alt=""
          width={20}
          height={20}
        />
      )}
    </div>
  );
};

export default Badge;
