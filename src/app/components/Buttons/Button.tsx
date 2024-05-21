import { twMerge } from "tailwind-merge";
import { ReactNode } from "react";

type ButtonType = "primary" | "secondary" | "tertiary";

interface SharedProps {
  gradient?: boolean;
  pink?: boolean;
  buttonType: ButtonType;
  outline?: boolean;
}

export interface ButtonProps
  extends SharedProps,
    React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    > {
  bgOverride?: boolean;
  wrapperClassName?: string;
  overrideBaseClass?: string;
}

const getBaseClass = (
  buttonType: ButtonProps["buttonType"],
  gradient?: ButtonProps["gradient"],
  bgOverride?: ButtonProps["bgOverride"],
  outline?: ButtonProps["outline"]
): string => {
  if (buttonType === "primary" && gradient) {
    return "btn bg-gradient-to-r from-[#00F0FF] to-[#CBFF5E]";
  } else if (buttonType === "primary" && !gradient) {
    return "btn bg-[#7C7CFF] border-[0px] hover:bg-[#7C7CFF]";
  } else if (buttonType === "secondary" && gradient) {
    return "bg-[#03001A] px-6 py-[20px]";
  } else if (buttonType === "tertiary" && !gradient && !outline) {
    return "btn bg-[#fff] hover:bg-[#fff] px-6 py-2";
  } else if (buttonType === "tertiary" && !gradient && outline) {
    return "btn bg-transparent hover:bg-transparent border-[#fff] border-opacity-100 hover:border-[#fff] px-6 py-2";
  }
  return "btn border-[2px] border-[#2A2A51] hover:bg-[#2A2A51] disabled:text-white disabled:text-opacity-60 hover:border-[2px]" +
    bgOverride
    ? ""
    : "bg-[#03001A]";
};

interface WrapperProps extends SharedProps {
  children: ReactNode;
  rounded?: string;
  wrapperClassName?: string;
}

const Wrapper = ({
  children,
  buttonType,
  gradient,
  rounded,
  pink,
  wrapperClassName,
}: WrapperProps) => {
  if (buttonType === "secondary" && gradient) {
    return (
      <div
        className={twMerge(
          pink
            ? "bg-gradient-to-r from-[#A76EF9] via-[#D384F9] to-[#F46B9C] p-[1px]"
            : "bg-gradient-to-r from-[#00F0FF] to-[#CBFF5E] p-[2px]",
          "h-fit w-fit",
          rounded
        )}
      >
        {children}
      </div>
    );
  }
  if (wrapperClassName) {
    return <div className={wrapperClassName}>{children}</div>;
  }
  return <>{children}</>;
};

const regex = /(?<rounded>rounded-\[\d+px\])/;

export const Button = (props: ButtonProps) => {
  const {
    children,
    className,
    buttonType,
    gradient,
    outline,
    overrideBaseClass,
    wrapperClassName,
    type = "button",
    bgOverride,
    ...rest
  } = props;
  const match = className?.match(regex);

  return (
    <Wrapper
      wrapperClassName={wrapperClassName}
      buttonType={buttonType}
      gradient={gradient}
      rounded={match?.groups?.rounded}
      pink={props.pink}
    >
      <button
        {...rest}
        className={twMerge(
          className,
          getBaseClass(buttonType, gradient, bgOverride, outline),
          overrideBaseClass
        )}
        type={type}
      >
        {children}
      </button>
    </Wrapper>
  );
};
