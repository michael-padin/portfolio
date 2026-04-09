import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        mono:    ["var(--font-mono)",    "monospace"],
        sans:    ["var(--font-sans)",    "sans-serif"],
      },
      colors: {
        bg: {
          DEFAULT:  "#0a0a0f",
          subtle:   "#0f0f1a",
          elevated: "#141420",
          border:   "#1e1e2e",
        },
        fg: {
          DEFAULT: "#e8e8f0",
          muted:   "#8888a8",
          subtle:  "#4a4a6a",
        },
        accent: {
          DEFAULT: "#00d4aa",
          dim:     "#00d4aa22",
          hover:   "#00f0c0",
        },
      },
      animation: {
        "fade-up":    "fadeUp 0.6s ease forwards",
        "fade-in":    "fadeIn 0.4s ease forwards",
        blink:        "blink 1s step-end infinite",
        "gradient-x": "gradientX 6s ease infinite",
        float:        "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeUp:    { from: { opacity:"0", transform:"translateY(24px)" }, to: { opacity:"1", transform:"translateY(0)" } },
        fadeIn:    { from: { opacity:"0" }, to: { opacity:"1" } },
        blink:     { "0%,100%": { opacity:"1" }, "50%": { opacity:"0" } },
        gradientX: { "0%,100%": { backgroundPosition:"0% 50%" }, "50%": { backgroundPosition:"100% 50%" } },
        float:     { "0%,100%": { transform:"translateY(0px)" }, "50%": { transform:"translateY(-10px)" } },
      },
      backgroundSize: { "200%": "200% 200%" },
    },
  },
  plugins: [],
};
export default config;
