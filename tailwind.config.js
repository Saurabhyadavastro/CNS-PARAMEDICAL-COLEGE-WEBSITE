/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#4169e1', // Royal Blue - primary brand (WCAG AA on white)
          dark: '#2a4dbd',    // Darker royal blue for active/hover states
          soft: '#347fe1',    // Medium royal blue for large text and UI only (fails AA contrast on white at small body sizes)
          faint: '#eef3fc',   // Very light tint for active highlights/tinted cards
        },
        surface: {
          DEFAULT: '#ffffff', // Pure white
          light: '#f7fcfe',   // Light section background from design system
          muted: '#edf4f9',   // Subtle panel/card alternate fill
        },
        navy: {
          dark: '#0a1128',    // Very dark navy for headers, footers & hero backdrops
          surface: '#111d40', // Elevated navy surface for mobile drawers & dropdowns
          border: '#1e2c56',  // Navy border divider
        },
        ink: {
          DEFAULT: '#171717', // High-contrast primary dark text
          muted: '#4b5563',   // Secondary text with verified contrast
          light: '#6b7280',   // Muted tertiary text/captions
          inverse: '#ffffff', // Inverse text on navy/brand backgrounds
        },
        accent: {
          DEFAULT: '#f7a604', // Secondary accent orange (badges, highlights, notice tags; never text on white)
          dark: '#c77800',    // Darker accent tone for accessible border/focus
          soft: '#fff8ea',    // Light warm background for accent badges
          ink: '#8c4b00',     // High-contrast deep amber text for badges on soft backgrounds
        },
        status: {
          success: '#15803d',
          'success-soft': '#f0fdf4',
          error: '#b91c1c',
          'error-soft': '#fef2f2',
          warning: '#b45309',
          'warning-soft': '#fffbeb',
          info: '#1d4ed8',
          'info-soft': '#eff6ff',
        },
        border: {
          subtle: '#e2e8f0',
          focus: '#4169e1',
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
        card: '0 2px 8px -2px rgba(10, 17, 40, 0.08), 0 1px 4px -1px rgba(10, 17, 40, 0.04)',
        'card-hover': '0 10px 24px -4px rgba(10, 17, 40, 0.12), 0 4px 8px -2px rgba(10, 17, 40, 0.06)',
        dropdown: '0 12px 30px -4px rgba(10, 17, 40, 0.2)',
      },
    },
  },
  plugins: [],
};
