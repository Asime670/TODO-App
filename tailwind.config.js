/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        satoshi: ['Satoshi', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
        display: ['Satoshi', 'sans-serif']
      }
    }
  },
  plugins: []
}
