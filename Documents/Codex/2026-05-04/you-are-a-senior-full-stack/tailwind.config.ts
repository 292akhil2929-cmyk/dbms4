import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#171717",
        paper: "#f7f5f0",
        line: "#d8d3c8",
        muted: "#65615a",
        accent: "#1f7668",
        risk: "#a84d3d"
      }
    }
  },
  plugins: []
};

export default config;
