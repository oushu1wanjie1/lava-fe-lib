/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors'
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      emerald: colors.emerald,
      indigo: colors.indigo,
      yellow: colors.yellow,
      'td-primary': {
        1: '#f2f3ff',
        2: '#d9e1ff',
        3: '#b5c7ff',
        4: '#8eabff',
        5: '#618dff',
        6: '#366ef4',
        7: '#0052d9',
        DEFAULT: '#0052d9',
        8: '#003cab',
        9: '#002a7c',
        10: '#001a57'

      },
      'td-error': {
        1: '#fff0ed',
        2: '#ffd8d2',
        3: '#ffb9b0',
        4: '#ff9285',
        5: '#f6685d',
        6: '#d54941',
        DEFAULT: '#d54941',
        7: '#ad352f',
        8: '#881f1c',
        9: '#68070a',
        10: '#490002',
      },
      'td-warn': {
        1: '#fff1e9',
        2: '#ffd9c2',
        3: '#ffb98c',
        4: '#fa9550',
        5: '#e37318',
        DEFAULT: '#e37318',
        6: '#be5a00',
        7: '#954500',
        8: '#713300',
        9: '#532300',
        10: '#3b1700'
      },
      'td-success': {
        1: '#e3f9e9',
        2: '#c6f3d7',
        3: '#92dab2',
        4: '#56c08d',
        5: '#2ba471',
        DEFAULT: '#2ba471',
        6: '#008858',
        7: '#006c45',
        8: '#005334',
        9: '#003b23',
        10: '#002515'
      }
    }
  },
  plugins: [],
}

