import * as HoverCard from "@radix-ui/react-hover-card";
import Image from "next/image";
import { ReactNode } from "react";

type BadgeProps = {
  tooltipContent: ReactNode;
  sizeClass?: string;
} & (
  | {
      imgSrc: string;
      icon?: never;
    }
  | {
      icon: ReactNode;
      imgSrc?: never;
    }
);

const Badge = ({
  tooltipContent,
  imgSrc,
  sizeClass = "w-4",
  icon,
}: BadgeProps) => {
  return (
    <HoverCard.Root>
      <HoverCard.Trigger asChild>
        <div className="flex-shrink-0 ml-2">
          {icon ?? (
            <Image
              className={`${sizeClass} cursor-pointer`}
              src={imgSrc || ""}
              width={16}
              height={16}
              alt=""
            />
          )}
        </div>
      </HoverCard.Trigger>
      <HoverCard.Content
        side="top"
        className="p-2 text-white bg-black rounded"
        align="center"
      >
        <div className="text-xs">{tooltipContent}</div>
      </HoverCard.Content>
    </HoverCard.Root>
  );
};
