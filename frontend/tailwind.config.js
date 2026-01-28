/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media', // automatically system theme follow karega
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["Fira Code", "monospace"],
      },
      colors: {
        brand: {
          dark: "#09090B",
          surface: "#121214",
          card: "#18181B",
          border: "#27272A",
          green: "#10B981",
          greenGlow: "#059669",
          orange: "#F97316",
        },
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(to right, #27272A 1px, transparent 1px), linear-gradient(to bottom, #27272A 1px, transparent 1px)",
        "radial-glow":
          "radial-gradient(circle at center, var(--tw-gradient-stops))",
      },
      animation: {
        blob: "blob 7s infinite",
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
      },
    },
  },
  plugins: [],
}
