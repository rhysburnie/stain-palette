import createStainSwatches from './createStainSwatches';
import mergeStainObjects from './mergeStainObjects';
import {defaultStainOptions} from './paletteDefaults';

const paletteDefaults = {...defaultStainOptions};
const defaultStain = createStainSwatches('$', '#ffffff', {
  name: 'grey (default)',
  accent: false,
});

const SYMBOL_PREFIX = Symbol('prefix');
const SYMBOL_INVERTED = Symbol('inverted');
const SYMBOL_MERGE_STAINS = Symbol('mergeStains');
const SYMBOL_STAIN_PREFIXES = Symbol('stainKeys');

export default class Palette {
  constructor(options = {}) {
    this.invalidPrefixes = [
      'prefix',
      'options',
      'stains',
      'inverted',
      'addStain',
      'addSwatch',
      'subscribe',
      'subscriptions',
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
      this.prefix = stain.prefix;
    };
    this[SYMBOL_MERGE_STAINS](defaultStain);
  }

  get prefix() {
    return this[SYMBOL_PREFIX];
  }

  set prefix(str) {
    if (this[SYMBOL_STAIN_PREFIXES].indexOf(str) > -1) {
      this[SYMBOL_PREFIX] = str;
      this.subscriptions.forEach(fn => fn());
    }
  }

  get inverted() {
    return this[SYMBOL_INVERTED];
  }

  set inverted(bool) {
    if (typeof bool === 'boolean' && bool !== this[SYMBOL_INVERTED]) {
      this[SYMBOL_INVERTED] = bool;
      this.subscriptions.forEach(fn => fn());
    }
  }

  addStain(prefix, sourceColor, options = {}) {
    const stain = createStainSwatches(prefix, sourceColor, {
      ...this.options,
      ...options,
    });
    this[SYMBOL_MERGE_STAINS](stain);
  }

  addSwatch(swatch = {}) {
    const valid = (() => {
      let validPrefixes =
        swatch.prefix === '*' ||
        this[SYMBOL_STAIN_PREFIXES].indexOf(swatch.prefix) > 1;
      if (swatch.inverse) {
        validPrefixes =
          swatch.inverse.prefix === '*' ||
          this[SYMBOL_STAIN_PREFIXES].indexOf(swatch.inverse.prefix) > 1;
      }
      return validPrefixes && this.invalidPrefixes.indexOf(swatch.id) < 0;
    })();

    if (valid) {
      if (!Object.getOwnPropertyDescriptor(this, swatch.id)) {
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
        Object.defineProperty(this, swatch.id, {
          get() {
            const key = getStainKey(swatch);
            return this.stains[key];
          },
        });
        Object.defineProperty(this.rgb, swatch.id, {
          get() {
            const key = getStainKey(swatch);
            return this.stains.rgb[key];
          },
        });
        Object.defineProperty(this.css, swatch.id, {
          get() {
            const key = getStainKey(swatch);
            return this.stains.css[key];
          },
        });
      }
    }
  }

  subscribe(fn) {
    this.subscriptions.push(fn);
  }
}
