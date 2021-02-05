module.exports = (componentName) => ({
    content: `// Generated with util/create-component.js
export { default } from './${componentName}';
`,
    fileName: `index.ts`
});
