import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

export const ThemeToggle = () => {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    // Update the localStorage and document body class on theme change
    localStorage.setItem("theme", theme);
    document.body.classList.remove("dark", "light"); // Remove all potential theme classes
    document.body.classList.add(theme); // Add the current theme class
  }, [theme]); // Depend on theme to rerun this effect

  const handleThemeToggle = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  console.log("theme", theme);

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
