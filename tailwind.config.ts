import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        // Base surfaces
        base: {
          DEFAULT: "#070b14", // page background
          950: "#050810",
        },
        surface: {
          DEFAULT: "#0d1424", // sidebar / header
          raised: "#111a2e", // card background
          hover: "#16213a",
        },
        border: {
          DEFAULT: "rgba(255,255,255,0.07)",
          strong: "rgba(255,255,255,0.14)",
        },
        // Brand / accent
        brand: {
          blue: "#3b82f6",
          "blue-light": "#60a5fa",
          purple: "#8b5cf6",
          "purple-light": "#a78bfa",
          cyan: "#22d3ee",
        },
        // Semantic severity scale
        severity: {
          critical: "#ef4444",
          high: "#f97316",
          medium: "#eab308",
          low: "#3b82f6",
          info: "#64748b",
        },
        status: {
          success: "#10b981",
          warning: "#f59e0b",
          danger: "#ef4444",
          neutral: "#64748b",
        },
        text: {
          primary: "#e6ebf5",
          secondary: "#94a3b8",
          muted: "#5b6b85",
        },
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(59,130,246,0.15), 0 0 24px -4px rgba(59,130,246,0.35)",
        "glow-purple": "0 0 0 1px rgba(139,92,246,0.15), 0 0 24px -4px rgba(139,92,246,0.35)",
        "glow-critical": "0 0 0 1px rgba(239,68,68,0.2), 0 0 24px -4px rgba(239,68,68,0.45)",
        card: "0 1px 2px 0 rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
        "radial-fade":
          "radial-gradient(circle at 50% 0%, rgba(59,130,246,0.12), transparent 60%)",
      },
      backgroundSize: {
        grid: "32px 32px",
      },
      keyframes: {
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(0.85)" },
        },
        scan: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
        scan: "scan 3s linear infinite",
        "fade-in-up": "fade-in-up 0.4s ease-out",
        shimmer: "shimmer 2s linear infinite",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.125rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
