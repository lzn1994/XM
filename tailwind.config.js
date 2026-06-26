/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dai-blue': '#4A6FA5',
        'zhu-red': '#C84A3E',
        'zhu-green': '#5B8C5A',
        'tan-brown': '#8B6F47',
        'mi-white': '#F5F0E8',
        'nuan-white': '#FAF7F2',
        'mo-black': '#2C2C2C',
        'fu-gray': '#6B6B6B',
      },
      fontFamily: {
        sans: ['PingFang SC', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'title': ['20px', { fontWeight: '700' }],
        'module-title': ['16px', { fontWeight: '600' }],
        'body': ['14px', { fontWeight: '400' }],
        'helper': ['12px', { fontWeight: '400' }],
      },
      spacing: {
        'base': '4px',
        'module': '16px',
        'card-padding': '12px',
        'element': '8px',
      },
      borderRadius: {
        'card': '12px',
        'tag': '8px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0,0,0,0.08)',
        'hover': '0 4px 16px rgba(74,111,165,0.12)',
      },
    },
  },
  plugins: [],
}

