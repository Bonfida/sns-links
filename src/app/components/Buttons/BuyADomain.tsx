import Image from "next/image";
import { twMerge } from "tailwind-merge";

export const BuyADomainButton = ({
  customButtonStyle,
}: {
  customButtonStyle?: string;
}) => {
  return (
    <a href="https://www.sns.id/" target="_blank">
      <button
        style={{ backgroundImage: "var(--action-button-bg)" }}
        className={twMerge(
          customButtonStyle
            ? customButtonStyle
            : "px-3 py-2 font-bold text-base rounded-lg font-azeret text-action-button-text"
        )}
      >
        <div className="flex gap-2 items-center">
          <Image src="/bonfida/sns-global.svg" height={32} width={32} alt="" />
          <span> Purchase domain</span>
        </div>
      </button>
    </a>
  );
};
