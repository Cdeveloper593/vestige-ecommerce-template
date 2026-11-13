/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#101010',
        coal: '#171717',
        smoke: '#232323',
        bone: '#EDE8E0',
        sand: '#CFC8BC',
        vermilion: '#FF4D00',
      },
      fontFamily: {
        display: ['Anton', 'Arial Narrow', 'sans-serif'],
        sans: ['Archivo', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      letterSpacing: { mega: '0.35em' },
    },
  },
  plugins: [],
}
