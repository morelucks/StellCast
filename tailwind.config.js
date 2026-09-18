/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        stell: {
          bg: "#07090e",
          card: "#0f131d",
          hover: "#161c2b",
          border: "rgba(255, 255, 255, 0.08)",
          cyan: "#00f2fe",
          purple: "#7f00ff",
          yes: "#10b981",
          no: "#f43f5e",
        }
      }
    },
  },
  plugins: [],
}
