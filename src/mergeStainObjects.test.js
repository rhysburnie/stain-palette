import {test} from 'ava';

import mergeStainObjects from './mergeStainObjects';

test('preflight', t => t.is(typeof mergeStainObjects, 'function'));

test('mergeStainObjects', t => {
  const red = {
    prefix: 'r',
    name: 'red',
    sourceColor: '#ff0000',
    r0: '#ff0000',
    rgb: {
      r0: [255, 0, 0],
    },
    css: {
      r0: 'rgb(255,0,0)',
    },
  };
  const green = {
    prefix: 'g',
    name: 'green',
    sourceColor: '#00ff00',
    g0: '#ff0000',
    rgb: {
      g0: [0, 255, 0],
    },
    css: {
      g0: 'rgb(0,255,0)',
    },
  };
  const stains = mergeStainObjects(red, green);
  t.is(typeof stains.prefixes, 'object');
  t.is(stains.prefixes.r.sourceColor, '#ff0000');
  t.is(stains.prefixes.g.name, 'green');
  t.true(Array.isArray(stains.rgb.g0));
  t.is(stains.css.g0.indexOf('rgb('), 0);
  // these original stain properties
  // should not be present
  t.is(typeof stains.prefix, 'undefined');
  t.is(typeof stains.name, 'undefined');
  t.is(typeof stains.sourceColor, 'undefined');
});

test('mergeStainObjects with merged', t => {
  const red = {
    prefix: 'r',
    name: 'red',
    sourceColor: '#ff0000',
    r0: '#ff0000',
    rgb: {
      r0: [255, 0, 0],
    },
    css: {
      r0: 'rgb(255,0,0)',
    },
  };
  const green = {
    prefix: 'g',
    name: 'green',
    sourceColor: '#00ff00',
    g0: '#ff0000',
    rgb: {
      g0: [0, 255, 0],
    },
    css: {
      g0: 'rgb(0,255,0)',
    },
  };
  const merged = mergeStainObjects(red, green);
  const blue = {
    prefix: 'b',
    name: 'blue',
    sourceColor: '#00ff00',
    b0: '#ff0000',
    rgb: {
      b0: [0, 255, 0],
    },
    css: {
      b0: 'rgb(0,255,0)',
    },
  };
  const stains = mergeStainObjects(merged, blue);
  // works as long as merged is first
  // also no validation is made to prevent overwrite of prefixes
  t.truthy(stains.prefixes.r);
  t.truthy(stains.prefixes.g);
  t.truthy(stains.prefixes.b);
  t.truthy(stains.rgb.r0);
  t.truthy(stains.rgb.g0);
  t.truthy(stains.rgb.b0);
});
