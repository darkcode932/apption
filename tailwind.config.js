/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "neutral-450": "#8a8a93",
        "green-455": "#10b981",
        "red-650": "#be123c",
      },
      backgroundImage: {
        back1: 'url("/assets/images/bg_1.jpg")',
        back2: 'url("/assets/images/bg_2.jpg")',
        back3: 'url("/assets/images/bg_3.jpg")',
        back4: 'url("/assets/images/bg_4.png")',
        back5: 'url("/assets/images/presentation.jpg")',
        back6: 'url("/assets/images/limitation.jpg")',
        back7: 'url("/assets/images/libération.jpg")',
        back8: 'url("/assets/images/bg_6.png")',
        back9: 'url("/assets/images/bg_7.png")',
        back10: 'url("/assets/images/bg_8.png")',
      }
    },
    screens: {
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
      xxl: "1600px",
    },
  },
  plugins: [],
}
