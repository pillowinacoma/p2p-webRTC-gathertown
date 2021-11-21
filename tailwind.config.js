/* eslint-disable @typescript-eslint/no-var-requires */
const windmill = require('@windmill/react-ui/config')
const colors = require('tailwindcss/colors')

module.exports = windmill({
    purge: {
        enabled: true,
        // in the content prop you should put all the files
        // that are using tailwindcss classes, for example:
        // content: ["./src/**/*.js", "./public/index.html"],
        // or
        // content: ["./src/**/*.vue", "./public/index.html"],
        // or
        // content: ["./src/**/*.jsx", "./public/index.html"],
        content: ['./client/**/*.tsx', './client/index.html'],
        options: {
            safelist: [
                'w-1/2',
                'w-1/3',
                'w-1/4',
                'w-1/5',
                'w-1/6',
                'w-1/7',
                'w-1/8',
                'w-1/9',
                'w-1/10',
                'w-1/11',
                'w-1/12',
                'w-1/13',
                'w-1/14',
                'w-1/15',
            ],
        },
    },
    theme: {
        colors: {
            ...colors,
            current: 'current',
            transparent: 'transparent',
        },
        variants: [
            'responsive',
            'group-hover',
            'focus-within',
            'first',
            'last',
            'odd',
            'even',
            'hover',
            'focus',
            'active',
            'visited',
            'disabled',
        ],
        plugins: [require('@tailwindcss/forms')],
    },
})
