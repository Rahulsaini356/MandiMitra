/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#173B2B',
          900: '#0F261C',
          800: '#173B2B',
          700: '#224D39',
          600: '#315C43',
        },
        agrigreen: {
          DEFAULT: '#315C43',
          light: '#427558',
        },
        sage: {
          DEFAULT: '#8FA58E',
          light: '#B2C4B1',
          dark: '#6E856D',
        },
        ivory: {
          DEFAULT: '#F7F5EF',
          light: '#FCFBF8',
          dark: '#EBE8DE',
        },
        warmgray: {
          DEFAULT: '#EEEDE7',
          50: '#FBFBF9',
          100: '#F5F4F0',
          200: '#EEEDE7',
          300: '#DFDDD4',
          400: '#C8C5B8',
        },
        charcoal: {
          DEFAULT: '#1D2420',
          light: '#2E3832',
          muted: '#68736C',
        },
        brass: {
          DEFAULT: '#B59658',
          light: '#D4BA7B',
          dark: '#8E733D',
          tint: '#F6F1E5',
        },
        riskred: {
          DEFAULT: '#A84242',
          light: '#F8EAEA',
          dark: '#853232',
        }
      },
      fontFamily: {
        serif: ['Newsreader', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'warm-sm': '0 1px 3px rgba(29, 36, 32, 0.05), 0 1px 2px rgba(29, 36, 32, 0.03)',
        'warm-md': '0 4px 16px -2px rgba(29, 36, 32, 0.06), 0 2px 6px -1px rgba(29, 36, 32, 0.03)',
        'warm-lg': '0 12px 30px -4px rgba(29, 36, 32, 0.08), 0 4px 12px -2px rgba(29, 36, 32, 0.04)',
        'forest-glow': '0 10px 25px -3px rgba(23, 59, 43, 0.25)',
        'brass-subtle': '0 0 0 1px rgba(181, 150, 88, 0.3), 0 2px 8px rgba(181, 150, 88, 0.1)',
      }
    },
  },
  plugins: [],
}
