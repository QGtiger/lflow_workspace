/** @type {import('tailwindcss').Config} */
export default {
  corePlugins: {
    preflight: false,
  },
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "rgba(221, 223, 227, 1)",
        "primary-black": "rgba(9, 9, 11, 1)",
        "secondary-grey": "rgba(136, 143, 157, 1)",
      },
    },
  },
};
