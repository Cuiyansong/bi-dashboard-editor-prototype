/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#f5f6f8",
        border: "#e8e8e8",
        primary: "#2E74FF",
        measure: "#52c41a",
        "figma-line": "rgba(0,0,0,0.12)",
        "figma-text": "rgba(0,0,0,0.85)",
        "figma-sub": "rgba(0,0,0,0.45)",
        "figma-azure-6": "rgba(46,136,255,0.06)",
        "figma-azure-8": "rgba(46,116,255,0.08)",
        "figma-grey-98": "#fafafa",
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};
