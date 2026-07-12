import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-jakarta)", "var(--font-inter)", "ui-sans-serif", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          DEFAULT: "#E8471E",
          dark: "#C93D18",
        },
        navy: {
          DEFAULT: "#1A1A2E",
        },
        amber: {
          brand: "#F5A623",
        },
      },
      boxShadow: {
        card: "0 2px 8px rgba(0,0,0,0.08)",
        modal: "0 4px 16px rgba(0,0,0,0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
