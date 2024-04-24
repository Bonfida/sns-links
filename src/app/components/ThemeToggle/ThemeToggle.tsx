import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

export const ThemeToggle = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
  );

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
          "absolute rounded-full h-[38px] w-[38px] bg-primary-bg border-t border-t-top-border-highlight shadow-theme-select transition-all duration-300 ease-in-out",
          theme === "light" ? "left-0" : "right-0"
        )}
        onClick={handleThemeToggle}
      >
        yo
      </button>
    </div>
  );
};
