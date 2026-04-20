const formsPlugin = require('@tailwindcss/forms')
const headlessuiPlugin = require('@headlessui/tailwindcss')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    fontSize: {
      xs:   ['0.75rem',  { lineHeight: '1rem' }],
      sm:   ['0.875rem', { lineHeight: '1.5rem' }],
      base: ['1rem',     { lineHeight: '1.75rem' }],
      lg:   ['1.125rem', { lineHeight: '2rem' }],
      xl:   ['1.25rem',  { lineHeight: '2rem' }],
      '2xl':['1.5rem',   { lineHeight: '2rem' }],
      '3xl':['2rem',     { lineHeight: '2.5rem' }],
      '4xl':['2.5rem',   { lineHeight: '3rem' }],
      '5xl':['3rem',     { lineHeight: '3.5rem' }],
      '6xl':['3.75rem',  { lineHeight: '1.1' }],
      '7xl':['4.5rem',   { lineHeight: '1.1' }],
      '8xl':['6rem',     { lineHeight: '1' }],
      '9xl':['8rem',     { lineHeight: '1' }],
    },
    extend: {
      colors: {
        maroon: {
          DEFAULT: '#C25757',
          mid:     '#A84545',
          light:   '#D46868',
          tint:    '#FBF0F0',
          deep:    '#6B2626',
        },
        green: {
          DEFAULT: '#236331',
          mid:     '#2B753A',
          deep:    '#184824',
          tint:    '#EBF5EC',
        },
        'off-white': '#F8F5F3',
        'gray-text':   '#5A5450',
        'gray-border': '#E2DCDA',
        /* keep legacy brand aliases so old imports don't break */
        brand: {
          green: {
            50:  '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            400: '#4ade80',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d',
          },
          red: {
            50:  '#fef2f2',
            100: '#fee2e2',
            500: '#ef4444',
            600: '#dc2626',
            700: '#b91c1c',
          },
        },
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      fontFamily: {
        sans:    'var(--font-inter)',
        display: 'var(--font-inter)',
      },
      maxWidth: {
        '2xl': '40rem',
        '8xl': '90rem',
      },
      boxShadow: {
        'maroon': '0 4px 24px -4px rgba(194,87,87,0.30)',
        'green':  '0 4px 24px -4px rgba(35,99,49,0.30)',
        'soft':   '0 2px 15px -3px rgba(0,0,0,0.07), 0 10px 20px -2px rgba(0,0,0,0.04)',
        'card':   '0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.05)',
      },
      animation: {
        'fade-in':  'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'reveal':   'reveal 400ms ease forwards',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        reveal: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [formsPlugin, headlessuiPlugin],
}
