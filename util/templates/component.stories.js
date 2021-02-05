module.exports = (componentName) => ({
  content: `// Generated with util/create-component.js
import React from "react";
import ${componentName} from "./${componentName}";

export default {
    title: "${componentName}"
    /* To make a fullscreen component use the layout parameter.
       Also requires 'style={{ width: '100vw', height: '100vh' }}'
       to be present on the component or a wrapper div.

    ,parameters: {
        layout: 'fullscreen'
    }*/
};

export const WithBar = () => <${componentName} foo="bar" />;

export const WithBaz = () => <${componentName} foo="baz" />;
`,
  fileName: `${componentName}.stories.tsx`
});
