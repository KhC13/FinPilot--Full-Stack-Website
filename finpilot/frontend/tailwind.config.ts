import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        base: {
          950: '#05060F',
          900: '#0A0D1C',
          800: '#0F1326',
          700: '#161B33'
        },
        glass: {
          DEFAULT: 'rgba(255,255,255,0.06)',
          light: 'rgba(255,255,255,0.10)',
          border: 'rgba(255,255,255,0.12)'
        },
        accent: {
          purple: '#8B5CF6',
          blue: '#3B82F6',
          cyan: '#22D3EE'
        },
        ink: {
          DEFAULT: '#F5F6FA',
          muted: '#94A3B8',
          faint: '#5B6478'
        },
        state: {
          success: '#34D399',
          warning: '#FBBF24',
          danger: '#F87171'
        }
      },
      fontFamily: {
        display: ['var(--font-sora)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace']
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #f00000 0%, #da7721 55%, #c2bf3a 100%)',
        'gradient-radial-glow': 'radial-gradient(circle at center, rgba(4, 4, 4, 0.25) 0%, rgba(34,211,238,0) 70%)',
        'gradient-card': 'linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)'
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(139,92,246,0.45)',
        'glow-cyan': '0 0 40px -8px rgba(34,211,238,0.4)',
        'glass-card': '0 8px 32px rgba(0,0,0,0.35)',
        'inner-glass': 'inset 0 1px 0 rgba(255,255,255,0.08)'
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' }
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.04)' }
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3.5s ease-in-out infinite',
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        shimmer: 'shimmer 2.5s linear infinite'
      }
    }
  },
  plugins: []
};

export default config;
