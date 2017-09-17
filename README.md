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
  prefix: '*',
  // '*' use current palette.prefix
  // can be any explicit registered stain prefix
  // however they MUST be registered first
  // otherwise the entire swatch will be rejected
  suffix: 0,   // one of the base scale keys (default 0, 50, 100, 200, 300 - 1000)

  // (optional)
  // use thse settings if `palette.inverted === true`
  // (otherwise will use default prefix / suffix)
  inverse: {
    prefix: '*',
    suffix: 1000
  }
};

palette.addSwatch('background', backgroundSwatch);
```

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

```
palette.prefix = 'r';
// works because it's registered
// if unknown prefix used the current `palette.prefix` will not change

palette.background === palette.stains.r0
// it's now red (in fact the exact sourceColor)
// because the default scale value 0 is white
// and any color multiplied over white remains the same
// (assuming you are using 'multiply' mode which is default)
```

In default mode `prefix` + `'0'` is sourceColor and the brightest available in the scale.

However the additional `prefix` + `'A'` (accent) is slightly lighter because by default
it is white mixed over the sourceColor.

> Note: the default 'greyscale' has no `greyscaleA` as it would be the same as `greyscale0` (white)

There is only one accent but you can configure palette to have more, in fact you can
define an entirely different base scale also.

More on that later...

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
