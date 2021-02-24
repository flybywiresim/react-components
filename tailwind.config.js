module.exports = {
    purge: [
        './src/**/*.html',
        './src/**/*.js',
    ],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            boxShadow: {
                'inner-sm': 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.05)'
            }
        },
    },
    variants: {
        extend: {},
    },
    plugins: [
        require('@flybywiresim/tailwind-config')
    ],
};
