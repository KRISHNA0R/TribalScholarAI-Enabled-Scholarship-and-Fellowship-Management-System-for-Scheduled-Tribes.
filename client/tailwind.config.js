/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // "gov-navy" class names are kept for compatibility across the codebase,
        // but the palette now expresses the TribalScholar AI identity:
        // Deep Forest Green (dominant) with earthy/saffron accents.
        gov: {
          navy: {
            50: '#f2f7f2',
            100: '#e0eee2',
            200: '#c2dcc6',
            300: '#9ac5a3',
            400: '#6ba877',
            500: '#4a8f58',
            600: '#377445',
            700: '#2c5c38',
            800: '#234a2d',
            900: '#14432a',
            950: '#0b2b1a',
          },
          saffron: {
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309',
            800: '#92400e',
            900: '#78350f',
          },
          green: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d',
          },
          // Warm off-white / cream surfaces
          cream: {
            50: '#fbfaf5',
            100: '#f7f4ea',
            200: '#efe9db',
          },
        },
      },
      fontFamily: {
        // Plus Jakarta Sans is the single global UI font.
        // Noto Sans Devanagari / Bengali are glyph fallbacks ONLY for Hindi & Bengali
        // text (Plus Jakarta Sans has no Indic glyphs) — Latin always renders in
        // Plus Jakarta Sans. Old font (Inter) fully removed.
        sans: ['Plus Jakarta Sans', 'Noto Sans Devanagari', 'Noto Sans Bengali', 'Noto Sans Ol Chiki', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
