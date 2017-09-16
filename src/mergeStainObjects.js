// NB: this will not handle if a supplied
//     stain is a merged stain(s) because
//     stucture is different.
// TODO: would be nice if if did but much more complex.

export default function mergeStainObjects(...stains) {
  const prefixes = [];
  let merged = {
    rgb: {},
    css: {},
    prefixes: {},
  };
  stains.forEach(({prefix, sourceColor, rgb, css, name, ...prefixed}) => {
    if (prefixes.indexOf(prefix) === -1) {
      if (typeof rgb === 'object') {
        merged.rgb = {...merged.rgb, ...rgb};
      }
      if (typeof css === 'object') {
        merged.css = {...merged.css, ...css};
      }
      if (prefix) {
        merged.prefixes = {
          ...merged.prefixes,
          [prefix]: {sourceColor, name},
        };
      }
      merged = {...merged, ...prefixed};
    }
  });
  return merged;
}
