module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      keyframes: {
        pulsefull: {
          '0%, 100% ': {
            opacity: 1
          },
          '50%': {
            opacity: .1
          }
        }
      },
      animation: {
        pulsefull: 'pulsefull 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;'
      },
      colors: {
        'swamp': '#cccc00'
      },
      spacing: {
        '54': '13.5rem'
      }
    },
    fontSize: {
      'landing-title': '1.7em',
      'scroll': "11.2px"
    },
    fontFamily: {
      'display': ['Montserrat']
    }
  },
  plugins: [],
}