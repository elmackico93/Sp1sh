/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0070e0',
          light: '#4d94ff',
          dark: '#0054a6',
        },
        secondary: '#6c757d',
        macos: {
          gray: '#f5f5f7',
          dark: '#1d1d1f',
        },
        windows: {
          blue: '#0078d7',
          gray: '#e6e6e6',
        },
        linux: {
          dark: '#300a24',
          green: '#26a269',
        },
        emergency: {
          red: '#ff3b30',
          orange: '#ff9500',
          yellow: '#ffcc00',
        },
        terminal: {
          bg: '#1e1e1e',
          text: '#f8f8f8',
          green: '#4af626',
        },
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        'pill': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0,0,0,0.08)',
        'md': '0 4px 6px rgba(0,0,0,0.08)',
        'lg': '0 10px 15px rgba(0,0,0,0.1)',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'Open Sans',
          'Helvetica Neue',
          'sans-serif',
        ],
        mono: [
          'SF Mono',
          'Menlo',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace',
        ],
      },
    },
  },
  plugins: [],
};
