/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media', // automatically system theme follow karega
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: { extend: {} },
  plugins: [],
}
