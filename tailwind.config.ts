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
        "bg-main": "var(--bg-main)",
        "footer-bg": "var(--footer-bg)",
        "generic-text": "var(--generic-text)",
        "topbar-border": "var(--topbar-border)",
        "topbar-text": "var(--topbar-text)",
        "action-button-bg": "var(--action-button-bg)",
        "action-button-text": "var(--action-button-text)",
        "action-button-border": "var(--action-button-border)",
        "focus-button-border": "var(--focus-button-border)",
        "list-item-bg": "var(--list-item-bg)",
        "list-item-text": "var(--list-item-text)",
        "list-item-border": "var(--list-item-border)",
        "primary-tag-text": "var(--primary-tag-text)",
        "primary-tag-border": "var(--primary-tag-border)",
        "search-input-text": "var(--search-input-text)",
        "search-input-border": "var(--search-input-border)",
        "search-input-bg": "var(--search-input-bg)",
        link: "var(--link)",
        "record-heading": "var(--record-heading)",
        "record-value": "var(--record-value)",
        "edit-button-top-border": "var(--edit-button-top-border)",
        "edit-button-bg": "var(--edit-button-bg)",
        "wallet-connect-bg": "var(--wallet-connect-bg)",
        "wallet-connect-text": "var(--wallet-connect-text)",
        "wallet-connect-top-border": "var(--wallet-connect-top-border)",
        "wallet-connect-popout-bg": "var(--wallet-connect-popout-bg)",
        "wallet-connect-popout-border": "var(--wallet-connect-popout-border)",
        "profile-overview-text": "var(--profile-overview-text)",
        "hero-section-text": "var(--hero-section-text)",
        "carousel-item-bg": "var(--carousel-item-bg)",
        "carousel-item-text": "var(--carousel-item-text)",
        "carousel-border": "var(--carousel-border)",
        "modal-bg": "var(--modal-bg)",
        "modal-border": "var(--modal-border)",
        "modal-input-bg": "var(--modal-input-bg)",
        "modal-text": "var(--modal-text)",
        "record-group-heading-text": "var(--record-group-heading-text)",
        "top-border-highlight": "var(--top-border-highlight)",
        "glass-bg": "var(--glass-bg)",
        "primary-bg": "var(--primary-bg)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
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
