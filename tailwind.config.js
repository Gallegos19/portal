/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Puedes personalizar tus colores aquí según las imágenes
        'primary': '#007bff',
        'teal': {
          50: '#e6fcf5',
          500: '#14b8a6',
          600: '#0d9488',
        },
        'blue': {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
        }
      },
    },
  },
  plugins: [],
}