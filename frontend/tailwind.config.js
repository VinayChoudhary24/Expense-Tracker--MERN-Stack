// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }
/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'], 
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    screens: {
      // Small screen mobile devices (e.g., iPhone SE, older Android phones)
      sm: '375px', // Updated to 375px to cover small mobile devices more accurately
      // Medium mobile screen devices (e.g., larger smartphones)
      md: '480px', // Updated to 480px to cover medium mobile screens more accurately
      // Tablets (e.g., iPads, larger Android tablets)
      lg: '768px', // 768px is commonly used for tablets
      // Laptops and desktops (e.g., standard laptops and computer monitors)
      xl: '1024px', // Updated to 1024px to include standard laptop and desktop sizes
      // Large desktop screens (optional; can be customized further if needed)
      '2xl': '1280px' // Updated to 1280px to cover larger screens
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};

