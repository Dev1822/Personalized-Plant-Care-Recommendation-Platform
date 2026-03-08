/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      colors: {
        forest: {
          50: '#f0fdf0',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        moss: {
          50: '#f7fce8',
          100: '#ecfac4',
          200: '#d9f58d',
          300: '#c0eb4e',
          400: '#a3d921',
          500: '#82b814',
          600: '#65910f',
          700: '#4d6e10',
          800: '#3d5512',
          900: '#344912',
          950: '#192808',
        },
        earth: {
          50: '#fdf8f0',
          100: '#fceedd',
          200: '#f8d9b5',
          300: '#f3be83',
          400: '#ec9a4e',
          500: '#e67e2a',
          600: '#d7641f',
          700: '#b34d1c',
          800: '#8f3e1f',
          900: '#74341c',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'score-fill': 'scoreFill 1.2s ease-out forwards',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(20px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        scoreFill: { '0%': { strokeDashoffset: '251.2' }, '100%': { strokeDashoffset: 'var(--target-offset)' } },
      }
    },
  },
  plugins: [],
}
