/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        geek: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 0.6s ease-in-out',
        'liquid-flow': 'liquidFlow 8s ease-in-out infinite',
        'glass-shimmer': 'glassShimmer 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        liquidFlow: {
          '0%, 100%': { 
            transform: 'translateX(0) translateY(0) scale(1)',
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%'
          },
          '25%': { 
            transform: 'translateX(20px) translateY(-10px) scale(1.1)',
            borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%'
          },
          '50%': { 
            transform: 'translateX(-10px) translateY(20px) scale(0.9)',
            borderRadius: '70% 30% 50% 50% / 30% 50% 60% 70%'
          },
          '75%': { 
            transform: 'translateX(10px) translateY(-5px) scale(1.05)',
            borderRadius: '40% 70% 60% 30% / 70% 40% 50% 60%'
          }
        },
        glassShimmer: {
          '0%': { 
            backgroundPosition: '-200% 0',
            opacity: '0.8'
          },
          '50%': { 
            backgroundPosition: '200% 0',
            opacity: '1'
          },
          '100%': { 
            backgroundPosition: '-200% 0',
            opacity: '0.8'
          }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-20px) rotate(1deg)' },
          '66%': { transform: 'translateY(10px) rotate(-1deg)' }
        }
      }
    },
  },
  plugins: [],
}
