/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        crypto: {
          dark: "#0B1121",
          darker: "#060913",
          card: "#151C2F",
          accent: "#00FFB3",
          "accent-dark": "#00CC8F",
          purple: "#7B5CFA",
          blue: "#3B82F6",
          error: "#FF6B6B",
          success: "#00FFB3",
          neutral: "#1A2236",
          "neutral-light": "#2A3349",
          ai: {
            primary: "#00FFB3",
            secondary: "#7B5CFA",
            glow: "#00FFB3",
            highlight: "#3B82F6",
            matrix: "#00CC8F",
          },
        },
      },
      boxShadow: {
        neon: "0 0 20px rgba(0, 255, 179, 0.15)",
        "neon-strong": "0 0 30px rgba(0, 255, 179, 0.3)",
        "neon-purple": "0 0 20px rgba(123, 92, 250, 0.15)",
        "ai-glow": "0 0 40px rgba(0, 255, 179, 0.2)",
        "matrix": "0 0 30px rgba(0, 204, 143, 0.25)",
      },
      animation: {
        glow: "glow 2s ease-in-out infinite alternate",
        pulse: "pulse 3s ease-in-out infinite",
        matrix: "matrix 20s linear infinite",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(0, 255, 179, 0.15)" },
          "100%": { boxShadow: "0 0 30px rgba(0, 255, 179, 0.3)" },
        },
        pulse: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
        },
        matrix: {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "100% 100%" },
        },
      },
      backgroundImage: {
        "ai-grid": "linear-gradient(to right, rgba(0, 255, 179, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 255, 179, 0.1) 1px, transparent 1px)",
      },
      backgroundSize: {
        "ai-grid": "30px 30px",
      },
    },
  },
  plugins: [],
};
