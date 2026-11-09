/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Navy ya kina (#0E2344) — funguo `navy-*` zimebaki ili madarasa yaliyopo yafuate rangi mpya
        navy: {
          50: '#eaf0f8',
          100: '#d5deec',
          200: '#aebdd6',
          300: '#8296bb',
          400: '#566f9c',
          500: '#3a5381',
          600: '#2a4069',
          700: '#1d3156',
          800: '#15284a',
          900: '#0e2344',
          950: '#091830',
        },
        // Dhahabu (#C89128) — funguo `gold-*`
        gold: {
          50: '#fdf4e3',
          100: '#f9e6c2',
          200: '#f1d097',
          300: '#e5b972',
          400: '#d9a245',
          500: '#c89128',
          600: '#a87818',
          700: '#8a5a08',
          800: '#6f4807',
          900: '#573907',
        },
        cream: '#f4f5f7', // ukurasa (kijivu hafifu)
        parchment: '#fdf4e3', // joto (cream ya dhahabu)
        line: '#e5e8ee',
        soft: '#5b6577',
        white: '#ffffff',
        ink: '#0e2344', // maandishi = navy
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        // maandishi ya mkono kwa msisitizo wa dhahabu
        script: ['Yellowtail', 'cursive'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      borderRadius: {
        none: '0px',
        sm: '6px',
        DEFAULT: '8px',
        md: '10px',
        lg: '12px',
        xl: '14px',
        '2xl': '18px',
        '3xl': '24px',
        full: '9999px',
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(14, 35, 68, 0.18)',
        card: '0 18px 40px -18px rgba(14, 35, 68, 0.25)',
        chip: '0 8px 24px -8px rgba(14, 35, 68, 0.22)',
      },
      container: {
        center: true,
        padding: { DEFAULT: '1.25rem', lg: '2rem' },
        screens: { '2xl': '1200px' },
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'soft-pulse': {
          '0%': { boxShadow: '0 0 0 0 rgba(200, 145, 40, 0.55)' },
          '70%': { boxShadow: '0 0 0 14px rgba(200, 145, 40, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(200, 145, 40, 0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        kenburns: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.08)' },
        },
      },
      animation: {
        kenburns: 'kenburns 4s ease-out both',
        'fade-up': 'fade-up 0.6s ease-out both',
        'soft-pulse': 'soft-pulse 2.6s ease-out infinite',
        float: 'float 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
