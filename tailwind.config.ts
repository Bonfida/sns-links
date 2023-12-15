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
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        azeret: ["Azeret", ...defaultTheme.fontFamily.sans],
      },
      animation: {
        "spin-speed": "spin 0.7s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
