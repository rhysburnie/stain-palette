import babel from 'rollup-plugin-babel';
/* eslint-disable import/extensions */
import babelrc from 'babelrc-rollup';
/* eslint-enable import/extensions */

const pkg = require('./package.json');

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

const external = Object.keys(pkg.dependencies || {});
external.push('react');
external.push('prop-types');

const globals = {
  'chroma-js': 'chroma',
  react: 'React',
  'prop-types': 'PropTypes',
};

function makeConfig({input, esFile, umdFile, umdName, sourcemap}) {
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
        globals,
        sourcemap,
      },
    ],
  };
}

const configs = [
  makeConfig({
    input: 'src/Palette.js',
    esFile: pkg['jsnext:main'],
    umdFile: pkg.main,
    umdName: pkg['umd:moduleName'],
    sourcemap: true,
  }),
];

// Add individuals used by Palette
[
  'paletteDefaults',
  'createStainSwatches',
  'mergeStainObjects',
  'react/PaletteProvider',
  'react/PaletteHOC',
].forEach(fileName =>
  configs.push(
    makeConfig({
      input: `src/${fileName}.js`,
      esFile: `dist/${fileName}.es.js`,
      umdFile: `dist/${fileName}.js`,
      umdName: fileName,
      sourcemap: true,
    }),
  ),
);

// configs.push({
//   input: 'src/react/PaletteProvider.js',
//   external,
//   plugins: [babel(rc)],
//   output: [
//     {
//       format: 'es',
//       file: 'dist/react/PaletteProvider.js',
//       sourcemap: true,
//     },
//     {
//       format: 'cjs',
//       file: 'dist/react/PaletteProvider.cjs.js',
//       sourcemap: true,
//     },
//   ],
// });

export default configs;
