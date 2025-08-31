/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'ubuntu': ['Ubuntu', 'sans-serif'],
        'orbitron': ['Orbitron', 'monospace'],
        'rajdhani': ['Rajdhani', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#e8f5ff',
          500: '#4cc9f0',
          600: '#3ba6cc',
          700: '#2a83a0',
        },
        accent: {
          500: '#E72585',
          600: '#d1126b',
          700: '#b00051',
        },
        purple: {
          500: '#560BAD',
          600: '#450892',
          700: '#340577',
        }
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
      },
    },
  },
  plugins: [],
}