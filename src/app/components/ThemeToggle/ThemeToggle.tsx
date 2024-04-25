import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import ThemeContext from "@/context/theme";

export const ThemeToggle = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.classList.remove("dark", "light");
    document.body.classList.add(theme);
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <div className="relative w-20 h-10 border-t border-t-top-border-highlight bg-glass-bg rounded-[40px]">
      <button
        className={twMerge(
          "absolute rounded-full h-[38px] w-[38px] bg-primary-bg border-t border-t-top-border-highlight shadow-theme-select transition-all duration-300 ease-in-out flex justify-center items-center",
          theme === "light" ? "left-0" : "right-0"
        )}
        onClick={handleThemeToggle}
      >
        <Image
          src={
            theme === "dark" ? "/theme/dark-mode.svg" : "/theme/light-mode.svg"
          }
          height={24}
          width={24}
          alt="theme-select"
        />
      </button>
    </div>
  );
};
