/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dai-blue': '#3A5A8C',
        'zhu-red': '#B83A2D',
        'zhu-green': '#5B8C5A',
        'tan-brown': '#8B6F47',
        'mi-white': '#F5F0E8',
        'nuan-white': '#FAF7F2',
        'mo-black': '#2C2C2C',
        'fu-gray': '#6B6B6B',
        'ink-light': '#E8DFD0',
      },
      fontFamily: {
        sans: ['PingFang SC', 'STKaiti', 'KaiTi', '楷体', 'system-ui', 'sans-serif'],
        kai: ['STKaiti', 'KaiTi', '楷体', 'PingFang SC', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'title': ['22px', { fontWeight: '700' }],
        'module-title': ['17px', { fontWeight: '600' }],
        'body': ['14px', { fontWeight: '400' }],
        'helper': ['12px', { fontWeight: '400' }],
      },
      spacing: {
        'base': '4px',
        'module': '16px',
        'card-padding': '16px',
        'element': '8px',
      },
      borderRadius: {
        'sm': '6px',
        'card': '12px',
        'lg': '16px',
        'xl': '20px',
        'tag': '8px',
      },
      boxShadow: {
        'card': '0 2px 12px rgba(58, 90, 140, 0.06)',
        'hover': '0 8px 24px rgba(58, 90, 140, 0.12)',
        'modal': '0 12px 40px rgba(0, 0, 0, 0.12)',
        'inner-soft': 'inset 0 1px 3px rgba(0, 0, 0, 0.04)',
        'soft': '0 1px 3px rgba(0, 0, 0, 0.04)',
        'glow-dai': '0 0 20px rgba(58, 90, 140, 0.2)',
        'glow-zhu': '0 0 20px rgba(184, 58, 45, 0.2)',
      },
      backgroundImage: {
        'gradient-dai': 'linear-gradient(135deg, #3A5A8C 0%, #4A6FA5 100%)',
        'gradient-zhu': 'linear-gradient(135deg, #B83A2D 0%, #C84A3E 100%)',
      },
    },
  },
  plugins: [],
}
