/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
      },
      colors: {
        pastel: {
          bg: '#F8FAFC',
          card: '#FFFFFF',
          accent: '#4F46E5',
          accentHover: '#4338CA',
          teal: '#0D9488',
          amber: '#D97706',
          rose: '#E11D48',
          blue: '#0284C7',
          border: '#E2E8F0'
        }
      }
    },
  },
  plugins: [],
}
