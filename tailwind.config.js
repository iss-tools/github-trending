/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/views/**/*.ejs",
    "./src/public/**/*.js"
  ],
  darkMode: 'class', // enable dark mode via class strategy
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        border: 'var(--border)',
        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
