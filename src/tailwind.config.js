/** @type {import('tailwindcss').Config} */
export default {
  content: [
    '../index.html', // Relative to src/ to reach public/index.html
    './**/*.{js,ts,jsx,tsx}', // Scan all files in src/ and subdirectories
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#1DA1F2',
        dark: '#14171A',
        light: '#AAB8C2',
        lighter: '#F5F8FA',
      },
    },
  },
  plugins: [],
};