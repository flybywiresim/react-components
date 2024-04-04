![FlyByWire Simulations](https://raw.githubusercontent.com/flybywiresim/branding/master/tails-with-text/FBW-Color-Dark.svg#gh-light-mode-only)
![FlyByWire Simulations](https://raw.githubusercontent.com/flybywiresim/branding/master/tails-with-text/FBW-Color-Light.svg#gh-dark-mode-only)

# FlyByWire Simulations React components library

## Installation

Install the library using npm:

    $ npm install --save @flybywiresim/react-components

## Development

### Testing

```
npm run test
```

### Building

```
npm run build
```

### Storybook

To run a live-reload Storybook server on your local machine:

```
npm run storybook
```

To export your Storybook as static files:

```
npm run storybook:export
```

You can then serve the files under `storybook-static` on GitHub pages.

### Generating New Components

To generate all the files needed to start building out a new component:

```
npm run generate YourComponentName
```

This will generate:

```
/src
  /YourComponentName
    YourComponentName.tsx
    YourComponentName.stories.tsx
    YourComponentName.test.tsx
    YourComponentName.types.ts
    YourComponentName.scss
    index.ts
```

The default templates for each file can be modified under `util/templates`.

Don't forget to add the component to your `index.ts` exports if you want the library to export the component!
