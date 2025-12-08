import tailwindAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
        "./index.html",
        "./*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./contexts/**/*.{js,ts,jsx,tsx}",
        "./hooks/**/*.{js,ts,jsx,tsx}",
        "./utils/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                border: "hsl(var(--border) / <alpha-value>)",
                input: "hsl(var(--input) / <alpha-value>)",
                ring: "hsl(var(--ring) / <alpha-value>)",
                background: "hsl(var(--background) / <alpha-value>)",
                foreground: "hsl(var(--foreground) / <alpha-value>)",
                primary: {
                    DEFAULT: "hsl(var(--primary) / <alpha-value>)",
                    foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
                    foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
                    foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted) / <alpha-value>)",
                    foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent) / <alpha-value>)",
                    foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover) / <alpha-value>)",
                    foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
                },
                card: {
                    DEFAULT: "hsl(var(--card) / <alpha-value>)",
                    foreground: "hsl(var(--card-foreground) / <alpha-value>)",
                },
                success: {
                    DEFAULT: "hsl(var(--success) / <alpha-value>)",
                    foreground: "hsl(var(--success-foreground) / <alpha-value>)",
                },
                warning: {
                    DEFAULT: "hsl(var(--warning) / <alpha-value>)",
                    foreground: "hsl(var(--warning-foreground) / <alpha-value>)",
                },
                chart: {
                    "1": "hsl(var(--chart-1) / <alpha-value>)",
                    "2": "hsl(var(--chart-2) / <alpha-value>)",
                    "3": "hsl(var(--chart-3) / <alpha-value>)",
                    "4": "hsl(var(--chart-4) / <alpha-value>)",
                    "5": "hsl(var(--chart-5) / <alpha-value>)",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            fontFamily: {
                sans: ["Inter", "sans-serif"],
                heading: ["Outfit", "sans-serif"],
                mono: ["JetBrains Mono", "monospace"],
            },
            boxShadow: {
                'glow': '0 0 20px rgba(var(--primary), 0.3)',
                'glow-sm': '0 0 10px rgba(var(--primary), 0.2)',
                'primary': '0 0 20px rgba(var(--primary), 0.3)',
                'primary-sm': '0 0 10px rgba(var(--primary), 0.2)',
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "shimmer": "shimmer 2s linear infinite",
                "fade-in": "fade-in 0.5s ease-out",
                "slide-up": "slide-up 0.5s ease-out",
                "slide-in-left": "slide-in-left 0.3s ease-out",
                "aurora-spin": "aurora-spin 20s linear infinite",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: 0 },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: 0 },
                },
                shimmer: {
                    from: { backgroundPosition: "0 0" },
                    to: { backgroundPosition: "-200% 0" },
                },
                "fade-in": {
                    from: { opacity: 0 },
                    to: { opacity: 1 },
                },
                "slide-up": {
                    from: { transform: "translateY(10px)", opacity: 0 },
                    to: { transform: "translateY(0)", opacity: 1 },
                },
                "slide-in-left": {
                    from: { transform: "translateX(-20px)", opacity: 0 },
                    to: { transform: "translateX(0)", opacity: 1 },
                },
                "aurora-spin": {
                    from: { transform: "rotate(0deg)" },
                    to: { transform: "rotate(360deg)" },
                },
            },
        },
    },
    plugins: [tailwindAnimate],
}
