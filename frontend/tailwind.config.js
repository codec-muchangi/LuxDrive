/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],

  theme: {
    extend: {
      // ── LUXDRIVE Design System ──────────────────────────────
      opacity: {
      '8': '0.08',
      '12': '0.12',
      '15': '0.15',
    },
      colors: {
        // Primary — Deep onyx black (hero backgrounds, nav, cards)
        primary: {
          50:  '#f7f7f7',
          100: '#ebebeb',
          200: '#d4d4d4',
          300: '#b0b0b0',
          400: '#888888',
          500: '#636363',
          600: '#4d4d4d',
          700: '#3a3a3a',
          800: '#262626',
          900: '#141414',   // ← main brand dark
          950: '#0a0a0a',   // ← deepest black
        },

        // Gold accent — luxury signifier
        gold: {
          50:  '#fdf9ed',
          100: '#faefc9',
          200: '#f4da8e',
          300: '#eec453',   // ← primary gold
          400: '#e9b02a',
          500: '#d4961a',
          600: '#b97614',
          700: '#965613',
          800: '#7b4316',
          900: '#673817',
          950: '#3c1c07',
        },

        // Neutral grays — UI surfaces and text
        surface: {
          50:  '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d1d1d6',
          400: '#a0a0ab',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        },

        // Semantic — status colors
        success: {
          50:  '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
        },
        warning: {
          50:  '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
        },
        error: {
          50:  '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
        },
        info: {
          50:  '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
        },
      },

      // ── Typography ──────────────────────────────────────────
      fontFamily: {
        // Display — used for hero headings and brand moments
        display: ['Playfair Display', 'Georgia', 'serif'],
        // Body — clean, readable sans-serif
        sans: ['Inter', 'system-ui', 'sans-serif'],
        // Mono — code, references, booking IDs
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },

      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
        'xs':  ['0.75rem',  { lineHeight: '1.125rem' }],
        'sm':  ['0.875rem', { lineHeight: '1.375rem' }],
        'base':['1rem',     { lineHeight: '1.625rem' }],
        'lg':  ['1.125rem', { lineHeight: '1.75rem' }],
        'xl':  ['1.25rem',  { lineHeight: '1.875rem' }],
        '2xl': ['1.5rem',   { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.375rem' }],
        '4xl': ['2.25rem',  { lineHeight: '2.75rem' }],
        '5xl': ['3rem',     { lineHeight: '3.5rem' }],
        '6xl': ['3.75rem',  { lineHeight: '4.25rem' }],
        '7xl': ['4.5rem',   { lineHeight: '5rem' }],
        '8xl': ['6rem',     { lineHeight: '6.5rem' }],
        '9xl': ['8rem',     { lineHeight: '8.5rem' }],
      },

      // ── Spacing ─────────────────────────────────────────────
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },

      // ── Animations ──────────────────────────────────────────
      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-left': {
          '0%':   { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-in-right': {
          '0%':   { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'gold-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(238, 196, 83, 0)' },
          '50%':       { boxShadow: '0 0 0 8px rgba(238, 196, 83, 0.1)' },
        },
        'slide-up': {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },

      animation: {
        'fade-in':       'fade-in 0.4s ease-out both',
        'fade-in-left':  'fade-in-left 0.4s ease-out both',
        'fade-in-right': 'fade-in-right 0.4s ease-out both',
        'slide-up':      'slide-up 0.5s ease-out both',
        'shimmer':       'shimmer 2s linear infinite',
        'gold-pulse':    'gold-pulse 2s ease-in-out infinite',
      },

      // ── Box Shadows ─────────────────────────────────────────
      boxShadow: {
        'card':   '0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.12), 0 12px 32px rgba(0,0,0,0.1)',
        'gold':   '0 0 0 2px rgba(238, 196, 83, 0.4)',
        'gold-lg':'0 4px 24px rgba(238, 196, 83, 0.2)',
        'dark':   '0 4px 24px rgba(0,0,0,0.5)',
        'nav':    '0 1px 0 rgba(255,255,255,0.06)',
        'modal':  '0 24px 64px rgba(0,0,0,0.6)',
      },

      // ── Border Radius ───────────────────────────────────────
      borderRadius: {
        'sm':  '4px',
        'md':  '8px',
        'lg':  '12px',
        'xl':  '16px',
        '2xl': '20px',
        '3xl': '24px',
      },

      // ── Screens / Breakpoints ───────────────────────────────
      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },

      // ── Background ──────────────────────────────────────────
      backgroundImage: {
        'gradient-luxury':
          'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #141414 100%)',
        'gradient-gold':
          'linear-gradient(135deg, #eec453 0%, #d4961a 100%)',
        'gradient-card':
          'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%)',
        'gradient-hero':
          'linear-gradient(to right, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.7) 60%, rgba(10,10,10,0.3) 100%)',
        'shimmer-bg':
          'linear-gradient(90deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)',
      },

      // ── Transitions ─────────────────────────────────────────
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    },
  },

  plugins: [],
}
