/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        glyde: {
          sidebar: '#3661eb',
          primary: '#2f5eed',
          lightBlue: '#edf2fc',
          subtleBg: '#f3f6fd',
          surface: '#ffffff',
          accentRed: '#f87171',
          accentTeal: '#10b981',
          accentPurple: '#6366f1',
          accentPink: '#ec4899',
          dark: '#1e293b',
          muted: '#94a3b8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'dashboard': '0 25px 60px -15px rgba(54, 97, 235, 0.15)',
        'card-soft': '0 4px 18px 0 rgba(70, 90, 140, 0.04)',
        'icon-badge': '0 8px 16px -4px rgba(54, 97, 235, 0.12)'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
