const paddingSafe = require('@la-moore/shared/scripts/tailwindcss-padding-safe')

module.exports = {
  presets: [
    require('@la-moore/shared/tailwind.config'),
  ],
  purge: [
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './node_modules/@la-moore/shared/**/*.{vue,js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {}
  },
  variants: {
    borderRadius: ['responsive', 'first', 'last'],
  },
  plugins: [
    paddingSafe()
  ],
}
