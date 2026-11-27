/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1A78B8', // Sky Blue - primary brand (WCAG AA 4.76:1 on white)
          dark: '#145F93',    // Darker sky blue for active/hover states (6.82:1 contrast)
          soft: '#2C8FD3',    // Medium sky blue for highlights and large text
          faint: '#F0F7FC',   // Very light sky blue tint for active backgrounds and cards
          navy: '#2B385C',    // Deep Navy brand anchor
        },
        surface: {
          DEFAULT: '#FFFFFF', // Crisp White
          light: '#F6F9FC',   // Very light neutral tint derived from sky/navy palette
          muted: '#EDF2F7',   // Subtle panel/card alternate fill with cool undertone
          warm: '#FAF7F5',    // Very light neutral warm tint
        },
        navy: {
          DEFAULT: '#2B385C', // Deep Navy (#2B385C) for headings & primary branding (11.46:1 contrast)
          dark: '#1D263F',    // Deepest navy for headers, footers & hero backdrops
          surface: '#36456E', // Elevated navy surface for mobile drawers & dropdowns
          border: '#465682',  // Navy border divider
        },
        ink: {
          DEFAULT: '#1E2538', // High-contrast primary dark text with deep navy undertone
          muted: '#4B5565',   // Secondary text with verified AA contrast
          light: '#6B7280',   // Muted tertiary text/captions
          inverse: '#FFFFFF', // Inverse text on navy/brand backgrounds
        },
        accent: {
          DEFAULT: '#D3532F', // Terracotta Orange (#D3532F) for CTAs, buttons, badges, highlights
          dark: '#B84323',    // Darker terracotta for hover states & accessible text (5.69:1 contrast)
          rust: '#C8826B',    // Warm Rust (#C8826B) for subtle borders or secondary accents
          soft: '#FDF5F2',    // Very light warm terracotta tint for badge backgrounds
          ink: '#96351A',     // High-contrast deep terracotta text for badges on soft backgrounds (8.91:1 contrast)
        },
        status: {
          success: '#15803d',
          'success-soft': '#f0fdf4',
          error: '#b91c1c',
          'error-soft': '#fef2f2',
          warning: '#b45309',
          'warning-soft': '#fffbeb',
          info: '#1A78B8',
          'info-soft': '#F0F7FC',
        },
        border: {
          subtle: '#E2E8F0',
          focus: '#1A78B8',
          rust: '#C8826B',
        },
      },
      fontFamily: {
        sans: ['"Open Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.4' }],       // 12px
        sm: ['0.8125rem', { lineHeight: '1.45' }],   // 13px
        base: ['0.875rem', { lineHeight: '1.5' }],    // 14px (standard desktop base)
        body: ['1rem', { lineHeight: '1.6' }],        // 16px (mobile-first body text)
        lg: ['1.125rem', { lineHeight: '1.5' }],      // 18px
        xl: ['1.25rem', { lineHeight: '1.4' }],       // 20px
        '2xl': ['1.5rem', { lineHeight: '1.3' }],     // 24px
        '3xl': ['1.875rem', { lineHeight: '1.25' }],  // 30px
        '4xl': ['2.25rem', { lineHeight: '1.2' }],    // 36px
      },
      boxShadow: {
        card: '0 2px 8px -2px rgba(43, 56, 92, 0.08), 0 1px 4px -1px rgba(43, 56, 92, 0.04)',
        'card-hover': '0 10px 24px -4px rgba(43, 56, 92, 0.12), 0 4px 8px -2px rgba(43, 56, 92, 0.06)',
        dropdown: '0 12px 30px -4px rgba(43, 56, 92, 0.2)',
      },
    },
  },
  plugins: [],
};
