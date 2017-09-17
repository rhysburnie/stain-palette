import createStainSwatches from './createStainSwatches';
import mergeStainObjects from './mergeStainObjects';
import {defaultStainOptions} from './paletteDefaults';

const paletteDefaults = {...defaultStainOptions};
const greyscaleStainPrefix = 'greyscale';
const greyscaleStain = createStainSwatches(greyscaleStainPrefix, '#ffffff', {
  name: 'grey (default)',
  accent: false,
});

const SYMBOL_PREFIX = Symbol('prefix');
const SYMBOL_INVERTED = Symbol('inverted');
const SYMBOL_MERGE_STAINS = Symbol('mergeStains');
const SYMBOL_STAIN_PREFIXES = Symbol('stainPrefixes');
const SYMBOL_RESERVED_PROPS = Symbol('reservedProps');
const SYMBOL_NOTIFY = Symbol('notify');

export default class Palette {
  constructor(options = {}) {
    this[SYMBOL_RESERVED_PROPS] = [
      'rgb',
      'css',
      'update',
      'stains',
      'prefix',
      'options',
      'inverted',
      'addStain',
      'addSwatch',
      'subscribe',
      'subscriptions',
      'validateSwatch',
      'getSwatchStainKey',
      'notificationsEnabled',
    ];
    this.options = {...paletteDefaults, ...options};
    this.subscriptions = [];
    this.stains = {};
    this.rgb = {};
    this.css = {};
    this.inverted = false;
    this[SYMBOL_NOTIFY] = true;
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
    if (prefix === this.prefix) return;
    this.update({prefix});
  }

  get inverted() {
    return this[SYMBOL_INVERTED];
  }

  set inverted(inverted) {
    if (inverted === this.inverted) return;
    this.update({inverted});
  }

  get notificationsEnabled() {
    return this[SYMBOL_NOTIFY];
  }

  set notificationsEnabled(notify) {
    if (typeof notify === 'boolean') {
      this[SYMBOL_NOTIFY] = notify;
    }
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

    if (this[SYMBOL_NOTIFY]) {
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

  addSwatch(id, swatch = {}) {
    const valid = this.validateSwatch(id, swatch);
    if (valid && !Object.getOwnPropertyDescriptor(this, id)) {
      Object.defineProperty(this, id, {
        get() {
          const key = this.getSwatchStainKey(swatch);
          return this.stains[key];
        },
      });
      Object.defineProperty(this.rgb, id, {
        get() {
          const key = this.getSwatchStainKey(swatch);
          return this.stains.rgb[key];
        },
      });
      Object.defineProperty(this.css, id, {
        get() {
          const key = this.getSwatchStainKey(swatch);
          return this.stains.css[key];
        },
      });
    }
  }

  addSwatches(swatches = {}) {
    const swatchIds = Object.keys(swatches);
    swatchIds.forEach(id => this.addSwatch(id, swatches[id]));
  }

  getSwatchStainKey(swatch) {
    const {inverse, ...normal} = swatch;
    const target = this.inverted ? inverse || {} : normal;
    let value = target[this.prefix];
    let prefix = this.prefix;
    if (typeof value === 'undefined') {
      value = target['*'];
    }
    if (typeof value === 'undefined') {
      value = normal[this.prefix];
    }
    if (typeof value === 'undefined') {
      value = normal['*'];
    }
    if (typeof value === 'object') {
      prefix = Object.keys(value)[0];
      value = value[prefix];
    }
    return prefix + value;
  }

  validateSwatch(id, swatch) {
    let valid = this[SYMBOL_RESERVED_PROPS].indexOf(id) < 0;
    const {inverse, ...normal} = swatch;
    const settings = [normal];
    if (inverse) settings.push(inverse);
    settings.forEach(setting => {
      const keys = Object.keys(setting || {});
      valid = keys.indexOf('*') > -1;
      if (valid) {
        keys.forEach(key => {
          if (key !== '*' && this[SYMBOL_STAIN_PREFIXES].indexOf(key) < 0) {
            valid = false;
          }
          if (valid && typeof setting[key] === 'object') {
            const valueKey = Object.keys(setting[key]);
            valid =
              valueKey.length === 1 &&
              this[SYMBOL_STAIN_PREFIXES].indexOf(valueKey[0]) > -1;
          }
        });
      }
    });
    return valid;
  }

  subscribe(fn) {
    this.subscriptions.push(fn);
  }
}
