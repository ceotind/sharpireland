/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'anton': ['Anton', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'brush': ['Alex Brush', 'cursive'],
      },
      colors: {
        // Light mode only - mapped to CSS variables
        'primary': {
          100: 'var(--primary-100)',
          200: 'var(--primary-200)',
          300: 'var(--primary-300)',
        },
        'accent': {
          green: 'var(--accent-green)',
          red: 'var(--accent-red)',
          'red-light': 'var(--accent-red-light)',
        },
        'text': {
          100: 'var(--text-100)',
          200: 'var(--text-200)',
          300: 'var(--text-300)',
        },
        'bg': {
          100: 'var(--bg-100)',
          200: 'var(--bg-200)',
          300: 'var(--bg-300)',
        },
        'error': {
          text: 'var(--error-text)',
          bg: 'var(--error-bg)',
          border: 'var(--error-border)',
        },
        'border': 'var(--border-color)',
        'white': 'var(--white-color)',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s cubic-bezier(0.8, 0, 0.2, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [],
}