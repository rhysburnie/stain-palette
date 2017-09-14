import chroma from 'chroma-js';

export {chroma};

export const MATERIAL_GREY = {
  0: '#ffffff',
  50: '#fafafa',
  100: '#f5f5f5',
  200: '#eeeeee',
  300: '#e0e0e0',
  400: '#bdbdbd',
  500: '#9e9e9e',
  600: '#757575',
  700: '#616161',
  800: '#424242',
  900: '#212121',
  1000: '#000000',
};

const defaultStainOptions = {
  scale: {
    bases: MATERIAL_GREY,
    mode: 'multiply',
  },
  accent: {
    bases: {A: 0.2},
    mode: 'mix',
    mixBase: MATERIAL_GREY[0],
  },
};

export function createStainSwatches(prefix, sourceColor, options = {}) {
  const stain = {prefix, sourceColor, rgb: {}, css: {}};
  const {name, scale, accent} = Object.assign(defaultStainOptions, options);
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
