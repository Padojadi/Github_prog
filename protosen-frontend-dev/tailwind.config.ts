import plugin from "tailwindcss/plugin";
import type { Config } from "tailwindcss";
import scrollbarhidePlugin from "tailwind-scrollbar-hide";
import tailwindScrollBar from "tailwind-scrollbar"

const config = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
  ],
  darkMode: ["class"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      boxShadow: {
        DEFAULT:
          "0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.02)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.02)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.01)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.01)",
      },
      outline: {
        blue: "2px solid rgba(0, 112, 244, 0.5)",
      },
      fontFamily: {
        "source-sans": ["var(--font-source-sans)", "sans-serif"],
        "londrina-solid": ["var(--font-londrina-solid)", "sans-serif"],
        "rubik": ["var(--font-rubik)", "sans-serif"],
        heading: [
          "var(--font-heading)",
          "ui-sans-serif",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI Variable Display",
          "Segoe UI",
          "Helvetica",
          "Apple Color Emoji",
          "Arial",
          "sans-serif",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
        mono: [
          "var(--font-mono)",
          ...require("tailwindcss/defaultTheme").fontFamily.mono,
        ],
        sans: [
          "var(--font-sans)",
          "ui-sans-serif",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI Variable Display",
          "Segoe UI",
          "Helvetica",
          "Apple Color Emoji",
          "Arial",
          "sans-serif",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
      fontSize: {
        xs: [
          "0.75rem",
          {
            lineHeight: "1.5",
          },
        ],
        sm: [
          "0.875rem",
          {
            lineHeight: "1.5715",
          },
        ],
        base: [
          "1rem",
          {
            lineHeight: "1.5",
            letterSpacing: "-0.01em",
          },
        ],
        lg: [
          "1.125rem",
          {
            lineHeight: "1.5",
            letterSpacing: "-0.01em",
          },
        ],
        xl: [
          "1.25rem",
          {
            lineHeight: "1.5",
            letterSpacing: "-0.01em",
          },
        ],
        "2xl": [
          "1.5rem",
          {
            lineHeight: "1.33",
            letterSpacing: "-0.01em",
          },
        ],
        "3xl": [
          "1.88rem",
          {
            lineHeight: "1.33",
            letterSpacing: "-0.01em",
          },
        ],
        "4xl": [
          "2.25rem",
          {
            lineHeight: "1.25",
            letterSpacing: "-0.02em",
          },
        ],
        "5xl": [
          "3rem",
          {
            lineHeight: "1.25",
            letterSpacing: "-0.02em",
          },
        ],
        "6xl": [
          "3.75rem",
          {
            lineHeight: "1.2",
            letterSpacing: "-0.02em",
          },
        ],
      },
      screens: {
        xs: "480px",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        brand: {
          DEFAULT: "hsl(var(--brand))",
          foreground: "hsl(var(--brand-foreground))",
        },
        highlight: {
          DEFAULT: "hsl(var(--highlight))",
          foreground: "hsl(var(--highlight-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-out': {
					'0%': { opacity: '1', transform: 'translateY(0)' },
					'100%': { opacity: '0', transform: 'translateY(10px)' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'scale-out': {
					from: { transform: 'scale(1)', opacity: '1' },
					to: { transform: 'scale(0.95)', opacity: '0' }
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' }
				},
				'slide-out-right': {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(100%)' }
				},
				'slide-up': {
					'0%': { transform: 'translateY(10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'pulse-soft': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' }
				},
				'count-up': {
					'0%': { transform: 'translateY(100%)' },
					'100%': { transform: 'translateY(0)' }
				},
				'card-hover': {
					'0%': { transform: 'translateY(0) scale(1)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' },
					'100%': { transform: 'translateY(-5px) scale(1.01)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }
				}
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        'fade-in': 'fade-in 0.3s ease-out',
				'fade-out': 'fade-out 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'scale-out': 'scale-out 0.2s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'slide-out-right': 'slide-out-right 0.3s ease-out',
				'slide-up': 'slide-up 0.6s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
				'count-up': 'count-up 1s ease-out',
				'card-hover': 'card-hover 0.3s ease-out forwards'
      },
      transitionProperty: {
				'height': 'height',
				'spacing': 'margin, padding',
			},
			transitionTimingFunction: {
				'bounce-in': 'cubic-bezier(0.38, 0.01, 0.25, 1.15)',
			},
      backgroundImage: {
        'gradient-background': 'linear-gradient(180deg, #f1f5f9 0%, #f8fafc 100%)',
        'gradient-background-dark': 'linear-gradient(180deg, #0f172a 0%, #020617 100%)',
        'gradient-hero': 'linear-gradient(135deg, #dcfce7 0%, #fef9c3 50%, #fee2e2 100%)',
        'gradient-hero-dark': 'linear-gradient(135deg, #14532d 0%, #713f12 50%, #7f1d1d 100%)',
				'gradient-card': 'linear-gradient(135deg, #FFFFFF 0%, #eef2ff 100%)',
        'gradient-card-dark': 'linear-gradient(135deg, #000000 0%, #1e1b4b 100%)',
        'gradient-footer': 'linear-gradient(180deg, #F9FAFB 0%, #F3F4F6 100%)',
        'gradient-footer-dark': 'linear-gradient(180deg, #020617 0%, #0f172a 100%)',
        'conference-details-hero': 'linear-gradient(rgba(224,231,255,0.6), rgba(207,250,254,0.6)), url(/images/conferences/conferences-hero-2.jpg)', 
        'conference-details-hero-dark': 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(/images/conferences/conferences-hero-2.jpg)', 
			},
    },
  },
  safelist: [
    // For the badge component
    "bg-indigo-100",
    "dark:bg-indigo-500/30",
    "text-indigo-600",
    "dark:text-indigo-400",
    "bg-blue-100",
    "dark:bg-blue-500/30",
    "text-blue-600",
    "dark:text-blue-400",
    // For the alert component
    "bg-orange-100",
    "border-l-orange-500",
    "border-orange-500",
    "text-orange-700",
    "bg-red-500",
    "bg-red-600",
    "bg-gray-500",
    "bg-gray-600",
    "bg-slate-500",
    "cursor-not-allowed",
  ],

  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/forms"),
    // add custom variant for expanding sidebar
    plugin(async ({ addVariant }) => {
      addVariant("sidebar-expanded", ".sidebar-expanded &");
    }),
    scrollbarhidePlugin,
    tailwindScrollBar({
      nocompatible: true,
      preferredStrategy: 'pseudoelements',
    })
  ],
} satisfies Config;

export default config;
