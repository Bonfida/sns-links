import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@bonfida/components/dist/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("./node_modules/@bonfida/components/tailwind.config.js")],
  theme: {
    extend: {
      boxShadow: {
        "theme-select": "0px 0px 8px 1px var(--theme-select-shadow)",
      },
      colors: {
        "footer-bg": "var(--footer-bg)",
        "topbar-border": "var(--topbar-border)",
        "action-button-bg": "var(--action-button-bg)",
        "action-button-text": "var(--action-button-text)",
        "focus-button-border": "var(--focus-button-border)",
        "list-item-bg": "var(--list-item-bg)",
        "list-item-text": "var(--list-item-text)",
        "list-item-border": "var(--list-item-border)",
        "primary-tag-text": "var(--primary-tag-text)",
        "primary-tag-border": "var(--primary-tag-border)",
        "search-input-text": "var(--search-input-text)",
        "search-input-border": "var(--search-input-border)",
        link: "var(--link)",
        "record-value": "var(--record-value)",
        "edit-button-bg": "var(--edit-button-bg)",
        "wallet-connect-bg": "var(--wallet-connect-bg)",
        "carousel-item-bg": "var(--carousel-item-bg)",
        "top-border-highlight": "var(--top-border-highlight)",
        "glass-bg": "var(--glass-bg)",
        "primary-bg": "var(--primary-bg)",
        "bio-placeholder-text": "var(--bio-placeholder-text)",
        "bio-text": "var(--bio-text)",
        "primary-text": "var(--primary-text)",
        "primary-border": "var(--primary-border)",
        "secondary-border": "var(--secondary-border)",
        "input-bg": "var(--input-bg)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      zIndex: {
        // 2_000 is required for toast popup
        "2_000": "2000",
        modal: "1999",
        "top-navbar": "1998",
        "1_900": "1900",
        "999": "999",
        "45": "45",
        "100": "100",
        "200": "200",
        "60": "60",
        "over-default": "1",
      },
      fontFamily: {
        azeret: ["Azeret", ...defaultTheme.fontFamily.sans],
      },
      animation: {
        "spin-speed": "spin 2s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
