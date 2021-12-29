const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    content: ["./public/**/*.{html,js,ejs}"],
    theme: {
        extend: {
            colors: {
                'terminal-green': '#282C34',
                'text-grey': '#BEBEBE',
                'lightspeed-red': '#D5372C',
                'mnubo-blue': '#509EE3'
            },
            margin: {
                'adjust': '25%',
            }
        },
        container: {
            center: true,
            padding: '2rem'
        }
    },
    plugins: [],
}