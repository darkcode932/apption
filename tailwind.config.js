/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
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
      xs: { min: "270px", max: "485px" },
      sm: { min: "576px" },
      md: { min: "768px" },
      lg: { min: "992px" },
      xl: { min: "1200px" },
      xxl: { min: "1600px" },
    },
  },
  plugins: [],
}
