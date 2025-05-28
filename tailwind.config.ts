import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        chat: {
          user: '#2563eb',
          assistant: '#f3f4f6',
          border: '#e5e7eb',
          hover: '#f9fafb'
        },
        brand: {
          primary: '#2563eb',
          secondary: '#10b981',
          accent: '#8b5cf6'
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-cinema': 'linear-gradient(-45deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1), rgba(16, 185, 129, 0.05), rgba(59, 130, 246, 0.1))',
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-in',
        'float': 'float linear infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'slide-in-up': 'slideInUp 0.6s ease-out forwards',
        'fade-in-scale': 'fadeInScale 0.8s ease-out forwards',
        'gradient-shift': 'gradient-shift 3s ease infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        float: {
          '0%': { 
            transform: 'translateY(0px) translateX(0px) rotate(0deg)',
            opacity: '0.2'
          },
          '33%': { 
            transform: 'translateY(-30px) translateX(10px) rotate(120deg)',
            opacity: '0.6'
          },
          '66%': { 
            transform: 'translateY(-20px) translateX(-10px) rotate(240deg)',
            opacity: '0.4'
          },
          '100%': { 
            transform: 'translateY(-40px) translateX(5px) rotate(360deg)',
            opacity: '0.1'
          }
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' }
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        slideInUp: {
          'from': { opacity: '0', transform: 'translateY(30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeInScale: {
          'from': { opacity: '0', transform: 'scale(0.9)' },
          'to': { opacity: '1', transform: 'scale(1)' }
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        }
      },
      backdropBlur: {
        'premium': '20px',
      }
    },
  },
  plugins: [],
};
export default config;