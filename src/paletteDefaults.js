export const MATERIAL_GREY_SCALE = {
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

export const FLOAT_SCALE = {
  0: 0,
  50: 0.05,
  100: 0.1,
  200: 0.2,
  300: 0.3,
  400: 0.4,
  500: 0.5,
  600: 0.6,
  700: 0.7,
  800: 0.8,
  900: 0.9,
  1000: 1,
};

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
