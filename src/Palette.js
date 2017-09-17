import createStainSwatches from './createStainSwatches';
import mergeStainObjects from './mergeStainObjects';
import {greyscaleStainOptions} from './paletteDefaults';

const paletteDefaults = {...greyscaleStainOptions};
const greyscaleStainPrefix = 'greyscale';
const greyscaleStain = createStainSwatches(greyscaleStainPrefix, '#ffffff', {
  name: 'grey (default)',
  accent: false,
});

const SYMBOL_PREFIX = Symbol('prefix');
const SYMBOL_INVERTED = Symbol('inverted');
const SYMBOL_MERGE_STAINS = Symbol('mergeStains');
const SYMBOL_STAIN_PREFIXES = Symbol('stainKeys');

const warn = msg => {
  try {
    console.warn(`Palette: ${msg}`); // eslint-disable-line
  } catch (err) {
    /* none */
  }
};

export default class Palette {
  constructor(options = {}) {
    this.invalidSwatchIds = [
      'prefix',
      'options',
      'stains',
      'inverted',
      'addStain',
      'addSwatch',
      'subscribe',
      'subscriptions',
      'update',
      'rgb',
      'css',
    ];
    this.options = {...paletteDefaults, ...options};
    this.subscriptions = [];
    this.stains = {};
    this.rgb = {};
    this.css = {};
    this.inverted = false;
    this[SYMBOL_MERGE_STAINS] = stain => {
      const {...stains} = this.stains;
      this.stains = mergeStainObjects(stains, stain);
      this[SYMBOL_STAIN_PREFIXES] = Object.keys(this.stains.prefixes);
    };

    this[SYMBOL_MERGE_STAINS](greyscaleStain);
    this.prefix = greyscaleStainPrefix;
  }

  get prefix() {
    return this[SYMBOL_PREFIX];
  }

  set prefix(prefix) {
    this.update({prefix});
  }

  get inverted() {
    return this[SYMBOL_INVERTED];
  }

  set inverted(inverted) {
    this.update({inverted});
  }

  /**
   * Both prefix and inverted can be set at the same
   * time by using the update method directly if desired.
   * It also allows for future features to update here too.
   */
  update(settings = {}) {
    const {prefix, inverted} = settings;
    if (
      typeof prefix === 'string' &&
      this[SYMBOL_STAIN_PREFIXES].indexOf(prefix) > -1
    ) {
      this[SYMBOL_PREFIX] = prefix;
    }
    if (typeof inverted === 'boolean' && inverted !== this[SYMBOL_INVERTED]) {
      this[SYMBOL_INVERTED] = inverted;
    }
    this.subscriptions.forEach(fn => fn());
  }

  addStain(prefix, sourceColor, options = {}) {
    const stain = createStainSwatches(prefix, sourceColor, {
      ...this.options,
      ...options,
    });
    this[SYMBOL_MERGE_STAINS](stain);
  }

  addSwatch(id, swatch = {}) {
    const valid = (() => {
      let validPrefixes =
        swatch.prefix === '*' ||
        this[SYMBOL_STAIN_PREFIXES].indexOf(swatch.prefix) > -1;
      if (swatch.inverse) {
        validPrefixes =
          swatch.inverse.prefix === '*' ||
          this[SYMBOL_STAIN_PREFIXES].indexOf(swatch.inverse.prefix) > -1;
      }
      return validPrefixes && this.invalidSwatchIds.join(',').indexOf(id) < 0;
    })();

    if (valid) {
      if (!Object.getOwnPropertyDescriptor(this, id)) {
        const getStainKey = swatchData => {
          let prefix =
            swatchData.prefix === '*' ? this.prefix : swatchData.prefix;
          let suffix = swatchData.suffix;
          if (this.inverted && swatchData.inverse) {
            prefix =
              swatchData.inverse.prefix === '*'
                ? this.prefix
                : swatchData.inverse.prefix;
            suffix = swatchData.inverse.suffix;
          }
          return prefix + suffix;
        };
        Object.defineProperty(this, id, {
          get() {
            const key = getStainKey(swatch);
            return this.stains[key];
          },
        });
        Object.defineProperty(this.rgb, id, {
          get() {
            const key = getStainKey(swatch);
            return this.stains.rgb[key];
          },
        });
        Object.defineProperty(this.css, id, {
          get() {
            const key = getStainKey(swatch);
            return this.stains.css[key];
          },
        });
      } else {
        warn(
          `invalid swatch id - reserved: ${this.invalidSwatchIds.join(',')}`,
        );
      }
    }
  }

  subscribe(fn) {
    this.subscriptions.push(fn);
  }
}
