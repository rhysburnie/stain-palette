import chroma from 'chroma-js';

import {MATERIAL_GREY_SCALE} from './defaultScales';

export const defaultStainOptions = {
  scale: {
    bases: MATERIAL_GREY_SCALE,
    mode: 'multiply',
  },
  accent: {
    bases: {A: 0.2},
    mode: 'mix',
    mixBase: MATERIAL_GREY_SCALE[0],
  },
};

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
            settings.mixBase,
            sourceColor,
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
