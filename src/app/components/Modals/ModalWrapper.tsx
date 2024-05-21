import { Transition, Dialog } from "@headlessui/react";
import { ReactNode, Fragment, useEffect } from "react";
import { useModalContext } from "@/hooks/useModalContext";
import { useUnmount } from "ahooks";
import { twMerge } from "tailwind-merge";

export const ModalWrapper = ({
  children,
  visible,
  setVisible,
  canClose,
  modalWrapperClassName,
}: {
  children: ReactNode;
  visible: boolean;
  setVisible: (x: boolean) => void;
  canClose?: boolean;
  modalWrapperClassName?: string;
}) => {
  const { setVisible: setVisibleContext } = useModalContext();

  // If not specificed set to true
  if (canClose === undefined) {
    canClose = true;
  }

  useEffect(() => {
    if (visible) {
      setVisibleContext(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const close = () => {
    setVisible(false);
    setVisibleContext(false);
  };

  return (
    <Transition appear show={visible} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-modal"
        onClose={() => !!canClose && setVisible(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 backdrop-blur-sm bg-[#0006]" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-x-hidden overflow-y-auto">
          <div className="flex items-end justify-center min-h-full md:p-4 md:items-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={twMerge(
                  "bg-primary-bg w-full md:w-auto max-w-[99vw] py-8 px-6 sm:py-[64px] sm:px-[48px] rounded-2xl border border-primary-border",
                  modalWrapperClassName
                )}
              >
                <Wrapper close={close}>{children}</Wrapper>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const Wrapper = ({
  children,
  close,
}: {
  close: () => void;
  children: ReactNode;
}) => {
  useUnmount(close);
  return <>{children}</>;
};
