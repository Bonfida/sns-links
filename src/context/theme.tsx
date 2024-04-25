import React, { createContext, useState, ReactNode } from "react";

type ThemeSetter = (theme: string | ((prevTheme: string) => string)) => void;

const ThemeContext = createContext<{
  theme: string;
  setTheme: ThemeSetter;
}>({
  theme: "",
  setTheme: () => {},
});

export const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
  );

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
