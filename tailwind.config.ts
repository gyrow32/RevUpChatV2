import type { Config } from "tailwindcss";

const config: Config = {
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
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-in'
      }
    },
  },
  plugins: [],
};
export default config;