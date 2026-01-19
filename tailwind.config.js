/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        ink: {
          900: "#0b0d10",
          800: "#11151c",
          700: "#1a1f2a",
        },
        terminal: {
          base: "#1b1f2b",
          header: "#161a24",
          border: "#2b3240",
          highlight: "#f5c56b",
          output: "#9fe8b2",
        },
      },
      boxShadow: {
        "terminal": "0 18px 50px rgba(0, 0, 0, 0.45)",
      },
    },
  },
  plugins: [],
};
