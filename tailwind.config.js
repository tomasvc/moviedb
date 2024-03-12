/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './features/**/*.{js,ts,jsx,tsx}'],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./features/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite-react/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        'Inter': ['Inter', 'sans-serif'],
      },
      keyframes: {
        fadeLeft: {
          '0%': { transform: 'translateX(-50px)', opacity: 0 },
          '100%': { transform: 'translateX(0px)', opacity: 100 },
        },
        fadeUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0px)', opacity: 100 },
        },
        expand: {
          "0%": { height: 0 },
          '100%': { height: '100%' },
        },
        fadeInDown: {
          '0%': { transform: 'translateY(-20px)', opacity: 0 },
          '100%': { transform: 'translateY(0px)', opacity: 100 },
        },
      },
      animation: {
        fadeLeft: 'fadeLeft 0.2s ease-in-out',
        fadeUp: 'fadeUp 0.25s ease-in-out',
        fadeInDown: 'fadeInDown 0.2s ease',
        expand: 'expand 0.25s ease-in-out'
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('flowbite/plugin')],
}

