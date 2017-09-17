# Stain Palette

## TODO

Get auto build working on install, currently would have to manually build.

## Usage

* `import Palette from 'stain-palette'`
  * or `const Palette = require('stain-palette')`
  * or `window.StainPalette` if `dist/Palette.umd.js` dropped into browser (would require that `chroma-js` is also present as `window.chroma`)

```
const palette = new Palette();
```

Creates a `pallete` object with default stain swatches registered as `palette.stains.greyscale0`, `palette.stains.greyscale50`, `palette.stains.greyscale100` to `palette.stains.greyscale1000`.

These are grey values — the same as grey in Material Design with the additional `0` (white) and `1000` (black).

While you can access stain swatches under the `.stains` object, **that is not the main purpose of `palette`**.

The point is to create semantic swatches from the stain swatches.

### Semantic Swatches

A semantic swatch is represented in POGO:

Example: _background_ swatch
```
const backgroundSwatch = {
  '*': 0,
  // (optional)
  inverse: {
    '*': 1000
  }
};

palette.addSwatch('background', backgroundSwatch);
```
**Important**

The swatch object **MUST** have at least `'*'` to be added, (the optional `inverse` object must also have at least `'*'`).

Now calling `palette.background` will return `palette.stains.greyscale0`
because `'greyscale'` (default) is the current `palette.prefix`, in which case
the color returned will be the hex value white `'#ffffff'`.

By calling `palette.inverted = true` the color returned would be black because
the `backgroundSwatch` has the `inverse` option.

OK but grey is boring.

### Adding Stains

What is a stain?

By default a stain is a source color multiplied over a base (The greyscale used
by the default `'greyscale'` stain).

It is possible to change the way it behaves but my main use case was for single
color stain palletes.

Example: a red stain scale:

```
const prefix = 'r';
const sourceColor = '#ff0000'; // names can be used as long as chroma-js knows them
palette.addStain(prefix, sourceColor);
```

`palette.stains.r0` etc will now exist along with an additional default accent (a mix of white over the source color at ratio 0.2) `palette.stains.rA`.

**But what the real purpose of `palette` is** we can change the `palette.prefix`.

`palette.prefix = 'r';`
works because it's registered, if unknown prefix used the current `palette.prefix` will not change.

`palette.background` will now be `palette.stains.r0`

In default mode `prefix` + `'0'` is sourceColor and the brightest available in the scale.

However the additional `prefix` + `'A'` (accent) is slightly lighter because by default
it is white mixed over the sourceColor.

> Note: the default 'greyscale' has no `greyscaleA` as it would be the same as `greyscale0` (white)

There is only one accent but you can configure palette to have more, in fact you can define an entirely different base scale also.

**TODO** explain that later, but there are caveats

### Advanced

For each swatch
The `'*'` value (stain suffix) will be used for all of current `palette.prefix`. If you desire a seperate suffix value for a specific prefix you can add the specific prefix key:

example: imagine you have the following registered: `'r'`, `'g'`, `'b'`.

```
palette.addSwatch('something', {
  '*': 0,
  'b': 500,
  inverse: {
    '*': 200
  }
})

`palette.prefix = 'r'`: `palette.something` is `palette.stains.r0`
`palette.prefix = 'g'`: `palette.something` is `palette.stains.g0`
`palette.prefix = 'b'`: `palette.something` is `palette.stains.b500`
`palette.inverted = true`:
`palette.prefix = 'r'`: `palette.something` is `palette.stains.r200`
`palette.prefix = 'g'`: `palette.something` is `palette.stains.g200`
`palette.prefix = 'b'`: `palette.something` is `palette.stains.b200`
```

But what if I want a color to never change regardless of `palette.prefix`?

```
palette.addSwatch('alwaysBlue', {
  '*': {'b': 500},
})
```

**NOTE** when using object as fixed value only one key is allowed or the entire swatch will be rejected.

### Add multiple swatches at once

```
palette.addSwatches({
  background: {
    '*': 900,
    y: 0,
    inverse: {
      '*': 500,
      y: 900,
    },
  },
  foreground: {
    '*': 0,
    y: {greyscale: 900},
    inverse: {
      '*': {greyscale: 0},
      y: 0,
    },
  },
})
```

## React helpers

(untested)

While not reliant on React in anyway there are two helper available to connect a
`palette` instance to components.

### `PaletteProvider`

```
// Somewhere top level...
import PaletteProvider from 'stain-palette/dist/react/PaletteProvider';
// ... stuff
const palette = new Palette();
// ...add stains and swatches...
const App = () => (
  <PaletteProvider palette={palette}>
    <SomeRootComponent />
  </PaletteProvider>
);
```

### `PaletteHOC`

For components to have access to `props.palette` they need to be wrapped
by the higher order component.

```
import PaletteHOC from 'stain-palette/dist/react/PaletteHOC';
import SomeComponent from './components/SomeComponent';

export default PaletteHOC(SomeComponent);
```
