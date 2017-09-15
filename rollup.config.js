import babel from 'rollup-plugin-babel';
/* eslint-disable import/extensions */
import babelrc from 'babelrc-rollup';
/* eslint-enable import/extensions */

const pkg = require('./package.json');

const external = Object.keys(pkg.dependencies || {});

// my hacky fix to: https://github.com/eventualbuddha/babelrc-rollup/issues/6
const rc = babelrc();
const doesNotAcceptOptions = ['stage-0'];
const acceptsOptionModules = ['es2015'];
rc.presets.forEach((preset, i) => {
  if (doesNotAcceptOptions.indexOf(preset[0]) > -1) {
    rc.presets[i] = preset[0];
  } else if (acceptsOptionModules.indexOf(preset[0]) === -1) {
    delete preset[1].modules; // eslint-disable-line
  }
});
// console.log(JSON.stringify(rc, null, 2));

function makeConfig({input, esFile, umdFile, umdName, umdGlobals, sourcemap}) {
  return {
    input,
    external,
    plugins: [babel(rc)],
    output: [
      {
        format: 'es',
        file: esFile,
        sourcemap,
      },
      {
        format: 'umd',
        file: umdFile,
        name: umdName,
        globals: umdGlobals,
        sourcemap,
      },
    ],
  };
}

export default [
  makeConfig({
    input: 'src/Palette.js',
    esFile: pkg['jsnext:main'],
    umdFile: pkg.main,
    umdName: pkg['umd:moduleName'],
    umdGlobals: {
      'chroma-js': 'chroma',
    },
    sourcemap: true,
  }),
  makeConfig({
    input: 'src/createStainSwatches.js',
    esFile: 'dist/createStainSwatches.js',
    umdFile: 'dist/createStainSwatches.umd.js',
    umdName: 'createStainSwatches',
    umdGlobals: {
      'chroma-js': 'chroma',
    },
    sourcemap: true,
  }),
  makeConfig({
    input: 'src/mergeStainObjects.js',
    esFile: 'dist/mergeStainObjects.js',
    umdFile: 'dist/mergeStainObjects.umd.js',
    umdName: 'mergeStainObjects',
    umdGlobals: {
      'chroma-js': 'chroma',
    },
    sourcemap: true,
  }),
  makeConfig({
    input: 'src/paletteDefaults.js',
    esFile: 'dist/paletteDefaults.js',
    umdFile: 'dist/paletteDefaults.umd.js',
    umdName: 'paletteDefaults',
    umdGlobals: {
      'chroma-js': 'chroma',
    },
    sourcemap: true,
  }),
];
