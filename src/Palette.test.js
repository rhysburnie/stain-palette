import {test} from 'ava';
import sinon from 'sinon';

import Palette from './Palette';

test('preflight', t => t.is(typeof Palette, 'function'));

test('new Palette()', t => {
  const palette = new Palette();
  t.is(typeof palette.stains, 'object');
  t.is(palette.prefix, 'greyscale');
  t.is(typeof palette.stains.prefixes.greyscale, 'object');
  t.is(palette.stains.greyscale0, '#ffffff');
  t.is(palette.stains.greyscale1000, '#000000');
  // cant change to unknown prefix
  palette.prefix = 'no';
  t.not(palette.prefix, 'no');
  palette.addStain('r', '#ff0000');
  t.is(palette.stains.r0, '#ff0000');
  t.not(palette.prefix, 'r');
  palette.prefix = 'r';
  t.is(palette.prefix, 'r');
  const backgroundSwatch = {
    '*': 0,
    r: 500,
    inverse: {
      '*': 1000,
    },
  };
  // internal (no need to use normally)
  // ==================================
  t.true(palette.validateSwatch('background', backgroundSwatch));
  t.true(!Object.getOwnPropertyDescriptor(palette, 'background'));
  t.is(palette.getSwatchStainKey(backgroundSwatch), 'r500'); // only works if valid!
  // ==================================
  palette.addSwatch('background', backgroundSwatch);
  t.is(palette.background, palette.stains.r500);
  palette.prefix = 'greyscale';
  t.is(palette.background, palette.stains.greyscale0);
  palette.inverted = true;
  t.is(palette.background, palette.stains.greyscale1000);
  palette.addStain('g', '#00ff00');
  palette.inverted = false;
  palette.prefix = 'g';
  t.is(palette.background, palette.stains.g0);
  palette.addSwatch('alwaysGreen', {
    '*': {g: 0},
  });
  palette.prefix = 'greyscale';
  t.is(palette.alwaysGreen, palette.stains.g0);
  palette.prefix = 'r';
  t.is(palette.alwaysGreen, palette.stains.g0);
  palette.inverted = true;
  t.is(palette.alwaysGreen, palette.stains.g0);
  t.is(palette.stains.gA.indexOf('#'), 0);
  // add multiple swatches at once
  palette.addSwatches({
    valid: {'*': 0},
    valid2: {
      '*': 1000,
      inverse: {
        '*': 0,
      },
    }, // must have at least '*' at root
    invalid: {ok: 0},
    // can't be a reserved prop of palette
    invalid2: {
      '*': 0,
      addSwatches: {'*': 0},
    },
    // stain prefix must be registered
    invalid3: {
      '*': 0,
      ok: {
        notdefined: 0,
      },
    },
    invalid4: {
      '*': 0,
      inverse: {
        '*': 0,
        // also inverse cant have inverse
        inverse: 0,
      },
    },
  });
  palette.inverted = false;
  palette.prefix = 'greyscale';
  t.is(palette.valid, '#ffffff');
  t.is(palette.valid2, '#000000');
  t.is(typeof palette.invalid, 'undefined');
  t.is(typeof palette.invalid2, 'undefined');
  t.is(typeof palette.invalid3, 'undefined');
  t.is(typeof palette.invalid4, 'undefined');
});

test('real life usage example', t => {
  const palette = new Palette();
  palette.addStain('r', 'red');
  palette.addStain('g', 'green');
  palette.addStain('b', 'blue');
  palette.addStain('y', 'yellow');
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
  });
  t.is(palette.background, palette.stains.greyscale900);
  t.is(palette.foreground, palette.stains.greyscale0);
  palette.inverted = true;
  t.is(palette.background, palette.stains.greyscale500);
  t.is(palette.foreground, palette.stains.greyscale0);
  palette.inverted = false;
  palette.prefix = 'r';
  t.is(palette.background, palette.stains.r900);
  t.is(palette.foreground, palette.stains.r0);
  palette.inverted = true;
  t.is(palette.background, palette.stains.r500);
  t.is(palette.foreground, palette.stains.greyscale0);
  palette.inverted = false;
  palette.prefix = 'g';
  t.is(palette.background, palette.stains.g900);
  t.is(palette.foreground, palette.stains.g0);
  palette.inverted = true;
  t.is(palette.background, palette.stains.g500);
  t.is(palette.foreground, palette.stains.greyscale0);
  palette.inverted = false;
  palette.prefix = 'b';
  t.is(palette.background, palette.stains.b900);
  t.is(palette.foreground, palette.stains.b0);
  palette.inverted = true;
  t.is(palette.background, palette.stains.b500);
  t.is(palette.foreground, palette.stains.greyscale0);
  palette.inverted = false;
  palette.prefix = 'y';
  t.is(palette.background, palette.stains.y0);
  t.is(palette.foreground, palette.stains.greyscale900);
  palette.inverted = true;
  t.is(palette.background, palette.stains.y900);
  t.is(palette.foreground, palette.stains.y0);
  palette.inverted = false;
});

test('test subscriptions', t => {
  const palette = new Palette();
  const spy = sinon.spy();
  palette.subscribe(spy);
  t.is(palette.prefix, 'greyscale');
  palette.prefix = 'greyscale';
  t.is(spy.callCount, 0);
  palette.inverted = true;
  t.is(spy.callCount, 1);
  palette.update();
  t.is(spy.callCount, 2);
  palette.addStain('r', 'red');
  palette.prefix = 'r';
  t.is(spy.callCount, 3);
  t.true(palette.notificationsEnabled);
  palette.notificationsEnabled = false;
  palette.inverted = false;
  t.false(palette.inverted);
  t.is(spy.callCount, 3);
  palette.notificationsEnabled = true;
  palette.inverted = true;
  t.is(spy.callCount, 4);
  palette.inverted = true;
  t.is(spy.callCount, 4);
});
