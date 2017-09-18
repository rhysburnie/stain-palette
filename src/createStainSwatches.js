import chroma from 'chroma-js';

import {defaultStainOptions} from './paletteDefaults';

export default function createStainSwatches(prefix, sourceColor, options = {}) {
  const stain = {prefix, sourceColor, rgb: {}, css: {}};
  const {name, scale, accent} = {...defaultStainOptions, ...options};
  if (name) stain.name = name;
  [scale, accent].forEach(settings => {
    if (typeof settings === 'object') {
      Object.keys(settings.bases).forEach(key => {
        let color;
        const propName = prefix + key;
        if (settings.mode === 'mix' && settings.mixBase) {
          color = chroma.mix(
            sourceColor,
            settings.mixBase,
            settings.bases[key],
            settings.mixMode || 'rgb',
          );
        } else {
          color = chroma.blend(sourceColor, settings.bases[key], settings.mode);
        }
        stain[propName] = color.hex();
        stain.rgb[propName] = color.rgb();
        stain.css[propName] = color.css();
      });
    }
  });
  return stain;
}
