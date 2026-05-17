/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        uob: {
          green: '#007569',
          'green-dark': '#005A51',
          'green-light': '#E8F5F3',
          gold: '#C4A84B',
        },
        bg: '#F4F6F8',
        danger: '#DC2626',
        success: '#16A34A',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}