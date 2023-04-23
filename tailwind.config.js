/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/**/*{html,js,tsx}'],
  theme: {
    colors: {
      ...colors,
    },
    extend: {},
  },
  plugins: [],
};
