/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#3B82F6",
          secondary: "#6366F1",
          success: "#22C55E",
          warning: "#FACC15",
          danger: "#EF4444",
          bg: "#0F172A",
          card: "#1E293B"
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"]
      },
      boxShadow: {
        glow: "0 25px 50px -12px rgba(59,130,246,0.25)"
      }
    }
  },
  plugins: [],
};

