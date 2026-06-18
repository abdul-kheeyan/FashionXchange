/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory:     '#FAF7F2',
        onyx:      '#1A1A1A',
        champagne: '#C9A24B',
        emerald:   '#0B3D2E',
        burgundy:  '#6B1E3C',
        warmgrey:  '#4A4A4A',
        hairline:  '#E4DFD6',
        'champagne-light': '#E8D5A3',
        'champagne-dark':  '#A07828',
        'ivory-dark':      '#F0EBE3',
        'onyx-light':      '#2A2A2A',
      },
      fontFamily: {
        serif:  ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        sans:   ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.25em',
        wider:  '0.15em',
      },
      boxShadow: {
        'soft':   '0 4px 24px rgba(0,0,0,0.06)',
        'card':   '0 2px 12px rgba(0,0,0,0.05)',
        'modal':  '0 20px 60px rgba(0,0,0,0.15)',
        'gold':   '0 4px 20px rgba(201,162,75,0.25)',
      },
      borderRadius: {
        DEFAULT: '2px',
        'sm':    '2px',
        'md':    '4px',
        'lg':    '6px',
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease-out',
        'slide-up':   'slideUp 0.5s ease-out',
        'zoom-in':    'zoomIn 0.3s ease-out',
        'shimmer':    'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        zoomIn: {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      transitionDuration: {
        '700': '700ms',
      },
    },
  },
  plugins: [],
}
