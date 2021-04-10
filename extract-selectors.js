const listSelectors = require('list-selectors');
const fs = require('fs');
const { exec } = require('child_process');

exec('tailwind build src/tailwind.css > build/tw.css', {}, () => {
    listSelectors(
        ['./build/tw.css'],
        { include: ['classes'] },
        ({ classes }) => {
            fs.writeFileSync(
                './build/usedCSSClasses.json',
                JSON.stringify(
                    classes.map((c) => c
                        .substring(1)
                        .split('\\')
                        .join('')),
                ),
            );
        },
    );
});
