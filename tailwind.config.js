const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    content: ["./public/**/*.{html,js,ejs}"],
    theme: {
        extend: {
            colors: {
                'terminal-green': '#333842',
                'text-grey': '#BEBEBE',
                'lightspeed-red': '#D5372C',
                'geoclique-green': '#6DBD53',
                'mnubo-blue': '#509EE3',
                'footer-grey': '#6B7687',
                'pink-gradient': '#50081C'
            },
            margin: {
                'adjust': '25%',
                '18': '4.5rem'
            },
            // screens: {
                // 'xs': '200px'
            // }
        },
        container: {
            center: true,
            padding: '2rem'
        },
    },
    plugins: [],
}