/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#8686f8",
        dark: "#010101",
        light: "#f2f2f7",
        secondary: "#4e4c49",
        muted: "#aeaeae",
      },
      fontFamily: {
        sans: ["Open Sans", "ui-sans", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
