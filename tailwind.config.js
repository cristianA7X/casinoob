/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./presentation/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        fondo: "#0F111A",
        superficie: "#1A1E2E",
        borde: "#2A314A",
        dorado: "#F5B82E",
        magenta: "#E91E63",
        exito: "#2ECC71",
        error: "#E74C3C",
        texto: "#F8FAFC",
        tenue: "#94A3B8",
      },
    },
  },
  plugins: [],
};
