/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./src/**/*.{html,ts,tsx}",
  ],
  daisyui: {
    themes: [
      {
        default: {
          "primary": 'rgb(30 58 138)',
        },
      },
    ],
  },
  plugins: [require("daisyui")],
}
