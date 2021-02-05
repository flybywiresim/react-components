module.exports = (componentName) => ({
  content: `// Generated with util/create-component.js
import React from "react";

import { ${componentName}Props } from "./${componentName}.types";

import "./${componentName}.scss";

const ${componentName} = (props: ${componentName}Props): JSX.Element => (
    <div data-testid="${componentName}" className="foo-bar">{props.foo}</div>
);

export default ${componentName};
`,
  fileName: `${componentName}.tsx`
});
