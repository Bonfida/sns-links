import { useState } from "react";
import { twMerge } from "tailwind-merge";

export const ThemeToggle = () => {
  const [isActive, setIsActive] = useState(false);
  return (
    <div className="relative w-20 h-10 border-t border-t-top-border-highlight bg-glass-bg rounded-[40px]">
      <button
        className={twMerge(
          "absolute rounded-full h-[38px] w-[38px] bg-primary-bg border-t border-t-top-border-highlight shadow-theme-select transition-all duration-300 ease-in-out",
          isActive ? "left-0" : "right-0"
        )}
        onClick={() => setIsActive(!isActive)}
      >
        yo
      </button>
    </div>
  );
};
