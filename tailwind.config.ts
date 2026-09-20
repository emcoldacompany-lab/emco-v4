import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Palette pulled from the EMCO LDA mark: bright brand blue + near-black ink.
        ink: '#101B27',
        steel: '#3E5266',
        mist: '#8CA0B4',
        concrete: '#E7EEF4',
        paper: '#F7FAFC',
        brand: '#1E9AE0',
        brandDark: '#0E7BB8',
        brandDeep: '#0B4C73',
      },
      fontFamily: {
        sans: ['Archivo', 'system-ui', 'sans-serif'],
        narrow: ['"Archivo Narrow"', 'Archivo', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        lift: '0 18px 40px -24px rgba(16,27,39,0.45)',
        card: '0 10px 30px -18px rgba(16,27,39,0.35)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        marquee: 'marquee 32s linear infinite',
        'fade-up': 'fadeUp 0.7s ease-out both',
        'fade-in': 'fadeIn 0.8s ease-out both',
      },
    },
  },
  plugins: [],
};
export default config;
