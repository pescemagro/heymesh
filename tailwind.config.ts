
import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "win95": {
          background: "#C0C0C0", // Classic Win95 gray
          titlebar: "#000080",   // Win95 window title blue
          titlebarText: "#FFFFFF",
          buttonFace: "#C0C0C0",
          buttonHighlight: "#FFFFFF",
          buttonShadow: "#808080",
          buttonDarkShadow: "#000000",
          desktop: "#008080",    // Teal desktop background
          text: "#000000",
          accent: "#DF93C3",     // Pink accent from the reference
          border: "#808080",
        },
      },
      fontFamily: {
        'ms-sans': ['"MS Sans Serif"', 'Arial', 'sans-serif'],
        'pixel': ['VT323', 'monospace'],
      },
      boxShadow: {
        'win95-out': 'inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf',
        'win95-in': 'inset -1px -1px #ffffff, inset 1px 1px #0a0a0a, inset -2px -2px #dfdfdf, inset 2px 2px #808080',
        'win95-btn': 'inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf',
        'win95-btn-pressed': 'inset -1px -1px #ffffff, inset 1px 1px #0a0a0a, inset -2px -2px #dfdfdf, inset 2px 2px #808080',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
