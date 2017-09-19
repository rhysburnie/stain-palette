import Palette from '../../Palette';

const palette = new Palette();

const sharedAccent = {
  mode: 'mix',
  mixBase: '#ffffff',
};

palette.addStain('r', 'red', {
  accent: {
    ...sharedAccent,
    bases: {A: 0.4},
  },
});
palette.addStain('g', 'green', {
  accent: {
    ...sharedAccent,
    bases: {A: 0.17},
  },
});
palette.addStain('b', 'blue', {
  accent: {
    ...sharedAccent,
    bases: {A: 0.3},
  },
});
palette.addStain('y', 'yellow', {
  accent: {
    ...sharedAccent,
    bases: {A: 0.65},
  },
});
const swatches = {
  background: {
    '*': 900,
    y: 0,
    inverse: {
      '*': 500,
      y: 900,
      greyscale: {greyscale: 100},
    },
  },
  background2: {
    '*': {greyscale: 1000},
    y: {y: 'A'},
    inverse: {
      '*': 0,
      y: {greyscale: 1000},
      greyscale: {greyscale: 200},
    },
  },
  foreground: {
    '*': 0,
    y: {greyscale: 900},
    inverse: {
      '*': {greyscale: 100},
      y: 0,
      greyscale: {greyscale: 900},
    },
  },
  foreground2: {
    '*': 300,
    y: {greyscale: 1000},
    inverse: {
      '*': {greyscale: 0},
      y: 'A',
      greyscale: 800,
    },
  },
  accent: {
    '*': 'A',
    y: {greyscale: 0},
    greyscale: {y: 0},
    inverse: {
      '*': 'A',
      y: {greyscale: 0},
      greyscale: {y: 0},
    },
  },
  warning: {
    '*': {y: 0},
    y: {r: 0},
    greyscale: {r: 0},
  },
  success: {
    '*': {greyscale: 500},
    y: {g: 400},
    greyscale: {g: 400},
  },
  info: {
    '*': {greyscale: 400},
    y: {b: 'A'},
    greyscale: {b: 'A'},
  },
};

palette.addSwatches(swatches);

export default palette;
