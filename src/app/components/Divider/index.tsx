import { twMerge } from "tailwind-merge";

export const Divider = ({ className }: { className: string }) => {
  return (
    <div
      className={twMerge(
        "bg-gradient-to-r from-transparent to-transparent via-link",
        className
      )}
    />
  );
};
