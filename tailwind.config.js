/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1152d4",
        "background-light": "#F9FAFB",
        "background-dark": "#101622",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "1rem",
        xl: "1.5rem",
        full: "9999px",
      },
      boxShadow: {
        primary: "0 20px 40px -12px rgba(17, 82, 212, 0.28)",
      },
    },
  },
  plugins: [],
};