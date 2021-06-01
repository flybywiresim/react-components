module.exports = {
    purge: {
        content: [
            './src/**/*.{html,js,jsx,ts,tsx}',
        ],
    },
    darkMode: false, // or 'media' or 'class'
    theme: { extend: { boxShadow: { 'inner-sm': 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.05)' } } },
    plugins: [
        require('@flybywiresim/tailwind-config'),
    ],
};
