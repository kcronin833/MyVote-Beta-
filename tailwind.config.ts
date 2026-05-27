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

        /* ── Desktop Redesign tokens (exact hex from spec) ──────── */
        page: "#F3F1EB",
        shade: "#F7F5EF",
        rule: "#E4E0D3",
        "rule-soft": "#EFEBE0",
        ink: {
          900: "#1A2138",
          700: "#3D435A",
          500: "#6B7088",
          400: "#8B8FA3",
          200: "#C9CCD7",
          100: "#DEE0E9", // kept for legacy
        },
        teal: {
          DEFAULT: "#3D8073",
          dk: "#2F6358",
          soft: "#E6F0ED",
          50:  "#f0f7f6",
          100: "#d9eeea",
          200: "#b3ddd5",
          300: "#80c4b8",
          400: "#4fa597",
          500: "#3D8073",
          600: "#326b61",
          700: "#285751",
          800: "#1e4440",
          900: "#152f2d",
        },
        "civic-red": {
          DEFAULT: "#B33A2C",
          soft: "#F5E3DF",
        },
        red: {
          DEFAULT: "#B33A2C",
          soft: "#F5E3DF",
        },
        amber: {
          DEFAULT: "#B8862F",
          soft: "#F4ECD8",
        },
        plum: "#6B3A6B",
        navy: "#1F3A5F",
        olive: "#5A6A2E",
        "paper-50":  "#F7F5EF",
        "paper-100": "#F3F1EB",
        "paper-200": "#E6E0D4",
        "lean-left":   "#3A6AA5",
        "lean-right":  "#A53A3A",
        "lean-center": "#7A7A7A",
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
        "avatar-ring": "0 0 0 3px #FFFFFF, 0 0 0 4px #E4E0D3",
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
