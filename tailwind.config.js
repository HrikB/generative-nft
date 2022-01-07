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
        },
        "floating-fade-in": {
          "0%": {
            transform: "translate(0, 30px)",
            opacity: 0
          },
          "100%": { transform: "translate(0, 0px)", opacity: 1 },
        },

      },
      animation: {
        pulsefull: 'pulsefull 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;',
        "floating-fade-in": 'floating-fade-in .4s ;',
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
      'scroll': "11.2px",
      'xxs': ".5rem"
    },
    fontFamily: {
      'display': ['Montserrat']
    }
  },
  plugins: [],
}