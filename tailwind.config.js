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
          "primary": "#1e3a8a",
          "secondary": "#93c5fd",
          "accent": "#bfdbfe",
          "neutral": "#d1d5db",
          "base-100": "#f3f4f6",
          "info": "#3E5CE0",
          "success": "#0F7041",
          "warning": "#AC8E06",
          "error": "#be123c",
        },
      },
    ],
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("daisyui"),
  ],
}
