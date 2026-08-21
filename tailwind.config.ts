import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "-apple-system", "sans-serif"],
        serif: ["var(--font-serif)", "Lora", "Georgia", "Times New Roman", "serif"],
      },
      colors: {
        /* ── shadcn semantics ─────────────────────────────────────── */
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },

        /* ── Brand tokens — Citizn design language (white / near-black / cool gray) ── */
        page: "#F5F5F7",
        shade: "#F0F0F3",
        rule: "#E9EBEF",
        "rule-soft": "#EEEFF3",
        ink: {
          900: "#030213",
          700: "#3D3D4A",
          500: "#717182",
          400: "#8B8B99",
          200: "#C9CACF",
          100: "#E1E3E9", // kept for legacy
        },
        teal: {
          DEFAULT: "#030213",
          dk: "#030213",
          soft: "#EFEFF3",
          border: "#D9DCE3", // tint-surface border
          50:  "#f4f4f6",
          100: "#e6e6ea",
          200: "#cfd0d7",
          300: "#a9abb6",
          400: "#6d6f7e",
          500: "#030213",
          600: "#030213",
          700: "#030213",
          800: "#030213",
          900: "#030213",
        },
        "civic-red": {
          DEFAULT: "#D4183D",
          soft: "#FCE7EA",
          border: "#F3C9D1",
        },
        red: {
          DEFAULT: "#D4183D",
          soft: "#FCE7EA",
          border: "#F3C9D1",
        },
        amber: {
          DEFAULT: "#B8862F",
          soft: "#F4ECD8",
          border: "#E2D2A8",
        },
        plum: "#6B3A6B",
        navy: "#1F3A5F",
        olive: "#5A6A2E",
        "paper-50":  "#F0F0F3",
        "paper-100": "#F5F5F7",
        "paper-200": "#E1E3E9",
        /* Saturated lenses — charts / desktop only */
        "lean-left":   "#3A6AA5",
        "lean-right":  "#A53A3A",
        "lean-center": "#7A7A7A",
        /* Muted lenses — the non-partisan editorial voice (DS canonical) */
        "lean-left-muted":   "#7796C2",
        "lean-right-muted":  "#C29377",
        "lean-center-muted": "#9CA39C",
      },
      borderRadius: {
        lg:    "var(--radius)",                /* 10px */
        md:    "calc(var(--radius) - 2px)",    /* 8px  */
        sm:    "calc(var(--radius) - 4px)",    /* 6px  */
        xl:    "calc(var(--radius) + 2px)",    /* 12px */
        "2xl": "calc(var(--radius) + 4px)",    /* 14px */
      },
      boxShadow: {
        "card-hairline": "0 1px 0 rgba(20,24,40,0.03)",
        "avatar-ring": "0 0 0 3px #FFFFFF, 0 0 0 4px #E9EBEF",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
