/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  presets : [
    require('./tailwindpreset.config.cjs')
  ],
  theme: {
    extend: {
      fontFamily: {
        primaryfont:
          'Proxima Nova, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      }
    },
  },
  plugins: [],
}

