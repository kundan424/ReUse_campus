/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#FBF9F5', // Woodwrights warm linen canvas
          subtle: '#F4EFEA',  // Subtle section background
          card: '#FFFFFF',
          stone: '#EFEBE4',
        },
        ink: {
          DEFAULT: '#1F1D1A', // Deep espresso / dark charcoal
          secondary: '#5C564E', // Warm muted taupe text
          muted: '#8A8276',   // Hairline metadata text
          subtle: '#B8B0A4',
        },
        border: {
          light: '#ECE7DF',   // Hairline card borders
          DEFAULT: '#DFD8CC', // Standard divider
          dark: '#2A2724',
        },
        earth: {
          moss: '#344335',    // Refined olive cypress / verified badge
          olive: '#4C5847',
          rust: '#8F5338',    // Terrecotta accent
          sand: '#D8CFBF',
          cream: '#FAF6EE',
        }
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      letterSpacing: {
        editorial: '0.18em',
        subtle: '0.06em',
      },
      boxShadow: {
        'wood': '0 2px 12px rgba(31, 29, 26, 0.04)',
        'wood-hover': '0 8px 24px rgba(31, 29, 26, 0.08)',
        'wood-modal': '0 20px 48px rgba(31, 29, 26, 0.12)',
      }
    },
  },
  plugins: [],
};
