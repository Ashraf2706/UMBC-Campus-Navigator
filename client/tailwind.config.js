/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'umbc-blue': '#fdb515',
        'umbc-gold': '#FFC20E',
        'umbc-dark-gold': '#E6A800',
        'umbc-black': '#000000',
      },
      fontFamily: {
        'sans': ['Roboto', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}