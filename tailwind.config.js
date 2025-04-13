/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#0D1117',
        secondary: '#161B22',
        accent: '#FF4405',
        'accent-hover': '#FF5D23',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
