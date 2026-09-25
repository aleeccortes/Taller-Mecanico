/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        taller: {
          bg: '#0f172a',
          card: '#1e293b',
          accent: '#ff6b00',
          hover: '#e05e00',
          metal: '#334155',
          text: '#f8fafc'
        }
      }
    },
  },
  plugins: [],
}
