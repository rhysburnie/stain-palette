import {test} from 'ava';

import Palette from './Palette';

test('preflight', t => t.is(typeof Palette, 'function'));

test('new Palette()', t => {
  const palette = new Palette();
  t.is(typeof palette.stains, 'object');
  t.is(palette.prefix, '$');
  t.is(typeof palette.stains.prefixes.$, 'object');
  t.is(palette.stains.$0, '#ffffff');
  t.is(palette.stains.$1000, '#000000');
  // cant change to unknown prefix
  palette.prefix = 'no';
  t.not(palette.prefix, 'no');
  palette.addStain('r', '#ff0000');
  t.is(palette.stains.r0, '#ff0000');
  palette.prefix = 'r';
  t.is(palette.prefix, 'r');
  const swatch = {
    prefix: '*',
    suffix: 0,
    inverse: {
      prefix: '*',
      suffix: 1000,
    },
  };
  palette.addSwatch('background', swatch);
  palette.prefix = 'r';
  t.is(palette.background, palette.stains.r0);
  palette.inverted = true;
  t.is(palette.background, palette.stains.$1000);
  palette.addStain('g', '#00ff00');
  palette.inverted = false;
  palette.prefix = 'g';
  t.is(palette.background, palette.stains.g0);
  palette.addSwatch('alwaysGreen', {
    prefix: 'g',
    suffix: 0,
  });
  palette.prefix = 'g';
  t.is(palette.alwaysGreen, palette.stains.g0);
  palette.inverted = true;
  t.is(palette.alwaysGreen, palette.stains.g0);
  t.is(palette.stains.gA.indexOf('#'), 0);
  palette.addSwatch('fixedPrefixColor', {
    prefix: '$',
    suffix: 0,
  });
  t.is(palette.fixedPrefixColor, '#ffffff');
});
