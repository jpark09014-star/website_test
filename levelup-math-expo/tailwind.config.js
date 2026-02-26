/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#3ab2fd',
          main: '#2db8ff',
          dark: '#1ea6ff',
        },
        success: {
          main: '#2bee6c',
          light: '#e0ffe8'
        }
      },
    },
  },
  plugins: [],
}
