const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    listStyleType: {
        none: 'none',
        disc: 'disc',
        decimal: 'decimal'
    },
    extend: {
      colors: {
        'primary': '#005a9c',
        'primary-dark': '#004d85',
        'primary-darker': '#102535',

        'primary-light':'#337bb0',
        'primary-lighter':'#669cc4',
        'primary-lightest': '#99bdd7',
        'primary-tint': '#eceeef',

        'secondary': '#d40000',
        'secondary-dark': '#aa0000',
        'secondary-darker': '#700101',
      }
    },
    fontSize: {
      '2xs': '.5rem',
      'xs': '.75rem',
      'sm': '.875rem',
      'tiny': '.875rem',
      'base': '1rem',
      'lg': '1.125rem',
      'xl': '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
      '7xl': '5rem',
    },
    screens: {
      ...defaultTheme.screens,
    }
  },
  plugins: [
  ],
}
