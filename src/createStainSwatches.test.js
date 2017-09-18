import {test} from 'ava';
import chroma from 'chroma-js';

import createStainSwatches from './createStainSwatches';
import {MATERIAL_GREY_SCALE, FLOAT_SCALE} from './paletteDefaults';

test('preflight', t => {
  t.is(typeof chroma, 'function');
  t.is(typeof createStainSwatches, 'function');
});

test('createStainSwatches (basic)', t => {
  const prefix = 'z';
  const stain = createStainSwatches(prefix, '#ffffff');
  // this will result in the same values as the default
  // scale.base (MATERIAL_GREY_SCALE) because white multiplied
  // to anything is the original color unchanged
  t.is(typeof stain, 'object');
  t.is(stain.sourceColor, '#ffffff');
  t.is(stain.z0, MATERIAL_GREY_SCALE[0]);
  t.is(stain.z500, MATERIAL_GREY_SCALE[500]);
  t.is(stain.z900, MATERIAL_GREY_SCALE[900]);
  t.is(stain.z1000, '#000000');
  // default accent would also be white in this case
  t.is(stain.zA, '#ffffff');
});

test('createStainSwatches (typical)', t => {
  const prefix = 'z';
  const options = {
    name: 'whatever',
    accent: {
      bases: {A: 0.2},
      mode: 'mix',
      mixBase: MATERIAL_GREY_SCALE[0],
    },
  };
  const sourceColor = '#ff0000';
  const stain = createStainSwatches(prefix, sourceColor, options);
  // once again sourceColor multiplied over MATERIAL_GREY_SCALE[0] is same
  t.is(stain.name, 'whatever');
  t.is(stain.z0, sourceColor);
  const expected500 = chroma
    .blend(sourceColor, MATERIAL_GREY_SCALE[500], 'multiply')
    .hex();
  t.is(stain.z500, expected500);
  const expected900 = chroma
    .blend(sourceColor, MATERIAL_GREY_SCALE[900], 'multiply')
    .hex();
  t.is(stain.z900, expected900);
  t.is(stain.z1000, '#000000');
  const expectedA = chroma.mix(
    sourceColor,
    options.accent.mixBase,
    options.accent.bases.A,
  );
  t.is(stain.zA, expectedA.hex());
  t.true(Array.isArray(stain.rgb.zA));
  t.is(stain.rgb.zA[1], expectedA.rgb()[1]);
  t.is(stain.css.zA, expectedA.css());
});

test('createStainSwatches (weird and wacky)', t => {
  const prefix = 'z';
  const options = {
    scale: {
      bases: FLOAT_SCALE,
      mode: 'mix',
      mixBase: '#e2d3f6',
    },
    accent: {
      bases: {A: 'lime', A2: 'cyan'},
      mode: 'dodge',
    },
  };
  const sourceColor = '#abcdef';
  const stain = createStainSwatches(prefix, sourceColor, options);
  const expected0 = chroma
    .mix(sourceColor, options.scale.mixBase, options.scale.bases[0])
    .hex();
  t.is(stain.z0, expected0);
  const expected500 = chroma
    .mix(sourceColor, options.scale.mixBase, options.scale.bases[500])
    .hex();
  t.is(stain.z500, expected500);
  const expectedA = chroma
    .blend(sourceColor, options.accent.bases.A, options.accent.mode)
    .hex();
  t.is(stain.zA, expectedA);
  const expectedA2 = chroma
    .blend(sourceColor, options.accent.bases.A2, options.accent.mode)
    .hex();
  t.is(stain.zA2, expectedA2);
});
