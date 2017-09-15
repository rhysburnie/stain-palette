import {test} from 'ava';

import Palette, {createStainSwatches, mergeStainObjects} from './index';

test('preflight', t => {
  t.is(typeof Palette, 'function');
  t.is(typeof createStainSwatches, 'function');
  t.is(typeof mergeStainObjects, 'function');
});

export {createStainSwatches, mergeStainObjects};
