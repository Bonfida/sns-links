import { ReactNode, useRef, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { twMerge } from "tailwind-merge";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useSmallScreen } from "@bonfida/hooks";
import { useClickAway, useUnmount } from "ahooks";
import { Button, type ButtonProps } from "../Buttons/Button";
import { useModalContext } from "../../../hooks/useModalContext";
import { useToastContext } from "../../../hooks/useToastContext";

import { ComponentPropsWithoutRef, memo } from "react";
import Image from "next/image";

interface SharedWrapProps {
  buttonType?: ButtonProps["buttonType"];
  gradient?: ButtonProps["gradient"];
  buttonClass?: ButtonProps["className"];
  wrapperClassName?: string;
  pink?: ButtonProps["pink"];
  mustBeConnected?: boolean;
  title?: string;
  ariaLabel?: string;
}

interface WrapProps extends SharedWrapProps {
  children: ReactNode;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const Wrap = ({
  buttonType,
  gradient,
  children,
  buttonClass,
  wrapperClassName,
  setVisible,
  pink,
  mustBeConnected,
  title,
  ariaLabel,
}: WrapProps) => {
  const { connected } = useWallet();
  const { setVisible: setWalletModalVisible } = useWalletModal();

  const handle = () => {
    if (!!mustBeConnected && !connected) {
      return setWalletModalVisible(true);
    }
    return setVisible(true);
  };

  if (buttonType) {
    return (
      <Button
        type="button"
        onClick={handle}
        className={buttonClass}
        wrapperClassName={wrapperClassName}
        buttonType={buttonType}
        gradient={gradient}
        pink={pink}
        title={title}
        aria-label={ariaLabel}
      >
        {children}
      </Button>
    );
  }
  return (
    <button
      type="button"
      onClick={handle}
      className={buttonClass}
      title={title}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};

interface ButtonModalProps extends SharedWrapProps {
  children: ReactNode;
  buttonText: ReactNode;
  modalClass?: string;
  visible?: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  closeIconClass?: string;
  disabled?: boolean;
}

export const ButtonModal = ({
  children,
  buttonText,
  modalClass,
  visible,
  setVisible,
  closeIconClass,
  disabled,
  ...wrapperRelatedProps
}: ButtonModalProps) => {
  const { toastVisible } = useToastContext();
  const smallScreen = useSmallScreen("sm", { wait: 500 });
  const clickAwayRef = useRef<HTMLDivElement>(null);
  const { visible: walletModalVisible } = useWalletModal();
  const { setVisible: setVisibleContext } = useModalContext();

  const close = () => {
    setVisibleContext(false);
    setVisible(false);
  };

  useClickAway(
    (event) => {
      const eventTarget = event.target as HTMLElement;

      if (
        !walletModalVisible &&
        !toastVisible &&
        // Handle the case when event came from some portal that is actually
        // outside of clickAwayRef, but shouldn't trigger modal closing
        eventTarget.tagName !== "A" &&
        eventTarget.tagName !== "BUTTON"
      ) {
        close();
      }
    },
    clickAwayRef,
    "mousedown"
  );

  useEffect(() => {
    if (visible) {
      setVisibleContext(true);
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [visible]);

  return (
    <>
      <Wrap setVisible={setVisible} {...wrapperRelatedProps}>
        {buttonText}
      </Wrap>
      <input
        disabled={disabled}
        type="checkbox"
        className="modal-toggle"
        onChange={() => setVisible((prev) => !prev)}
        checked={visible}
      />
      {visible && (
        <div
          className="modal z-modal modal-bottom md:modal-middle backdrop-blur-sm bg-white/10"
          style={{ margin: 0 }}
        >
          <div
            className={twMerge(
              "modal-box",
              modalClass,
              smallScreen && "w-screen pt-10"
            )}
            ref={clickAwayRef}
          >
            {!!closeIconClass && (
              <ModalCloseButton
                onClick={close}
                className={twMerge("absolute z-modal", closeIconClass)}
              />
            )}
            <WrapChildren close={close}>{children}</WrapChildren>
          </div>
        </div>
      )}
    </>
  );
};

const WrapChildren = ({
  close,
  children,
}: {
  close: () => void;
  children: ReactNode;
}) => {
  useUnmount(close);
  return <>{children}</>;
};

export const ModalCloseButton = memo(function ModalCloseButton({
  className,
  ...rest
}: { className?: string } & ComponentPropsWithoutRef<"button">) {
  return (
    <button
      {...rest}
      type="button"
      className={twMerge(
        "flex-shrink-0 border-2 border-white border-opacity-20 w-[48px] h-[48px] rounded-2xl flex items-center justify-center bg-transparent hover:bg-transparent",
        className
      )}
    >
      <Image
        width={14}
        height={14}
        className="w-[14px]"
        src="/close/close.webp"
        alt="close"
      />
    </button>
  );
});
