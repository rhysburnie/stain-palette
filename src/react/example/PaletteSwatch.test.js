import {test} from 'ava';
import sinon from 'sinon';
import React from 'react';
import PropTypes from 'prop-types';
import TestUtils from 'react-dom/test-utils';
import ShallowRenderer from 'react-test-renderer/shallow';
import {createConsoleErrorSpy} from '../../../test/helpers/console-utilities';
import PaletteProvider from '../PaletteProvider';
import PaletteSwatch from './PaletteSwatch';
import RawPaletteSwatch from './_/PaletteSwatch';
import demoStyles from './demo.styles';

const mockPalette = {
  subscribe: () => {},
  inverted: false,
  prefix: 'a',
  css: {},
};

const normal = {
  a: '#ffffff',
  z: '#000000',
  css: {
    a: 'rgb(255,255,255)',
    z: 'rgb(0,0,0)',
  },
};
const inverse = {
  a: '#000000',
  z: '#ffffff',
  css: {
    a: 'rgb(0,0,0)',
    z: 'rgb(255,255,255)',
  },
};

Object.defineProperty(mockPalette, 'background', {
  get() {
    return mockPalette.inverted
      ? inverse[mockPalette.prefix]
      : normal[mockPalette.prefix];
  },
});

Object.defineProperty(mockPalette.css, 'background', {
  get() {
    return mockPalette.inverted
      ? inverse.css[mockPalette.prefix]
      : normal.css[mockPalette.prefix];
  },
});

test('preflight', t => {
  t.is(typeof React, 'object');
  t.is(typeof PropTypes, 'object');
  t.is(typeof TestUtils, 'object');
  t.is(typeof PaletteSwatch, 'function');
  t.is(typeof RawPaletteSwatch, 'function');
});

test(t => {
  const palette = mockPalette;
  const spyErrors = createConsoleErrorSpy(sinon);
  const expectedErrors = [
    'Warning: Failed prop type: The prop `id` is marked as required',
  ];
  // requires prefix and suffix
  // won't throw but we can check errors with spy
  t.notThrows(() => {
    TestUtils.renderIntoDocument(
      <PaletteProvider palette={palette}>
        <PaletteSwatch />
      </PaletteProvider>,
    );
  });
  t.is(spyErrors.callCount, 1);
  t.true(spyErrors.errorCallContainsOneOf(expectedErrors, 0));
  spyErrors.reset();

  let tree;
  t.notThrows(() => {
    tree = TestUtils.renderIntoDocument(
      <PaletteProvider palette={palette}>
        <PaletteSwatch id="background" />
      </PaletteProvider>,
    );
  });
  t.is(spyErrors.callCount, 0);
  const child = TestUtils.findRenderedComponentWithType(tree, PaletteSwatch);
  t.is(child.context.palette, palette);
  const vdomDiv = TestUtils.findRenderedDOMComponentWithTag(tree, 'div');
  /* eslint-disable no-underscore-dangle */
  const style = vdomDiv[Object.keys(vdomDiv)[0]]._previousStyle;
  t.is(style.background, mockPalette.background);
  /* eslint-enable no-underscore-dangle */
  spyErrors.reset();

  // with info inside
  t.notThrows(() => {
    tree = TestUtils.renderIntoDocument(
      <PaletteProvider palette={palette}>
        <PaletteSwatch id="background" showInfo />
      </PaletteProvider>,
    );
  });
  t.is(spyErrors.callCount, 0);

  const vdomDivs = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'div');
  t.true(Array.isArray(vdomDivs));
  t.is(vdomDivs.length, 2);

  // to test render need to use the version
  // that hasn't been HOC connected
  t.notThrows(() => {
    const renderer = new ShallowRenderer();
    renderer.render(
      <RawPaletteSwatch palette={mockPalette} id="background" showInfo />,
    );
    const result = renderer.getRenderOutput();
    t.is(result.type, 'div');
    t.deepEqual(
      result.props.children,
      <div style={demoStyles.swatchInfo}>
        background
        <br />
        {normal.a}
        <br />
        {normal.css.a}
      </div>,
    );
  });
  t.is(spyErrors.callCount, 0);

  t.notThrows(() => {
    mockPalette.inverted = true;
    const renderer = new ShallowRenderer();
    renderer.render(
      <RawPaletteSwatch palette={mockPalette} id="background" showInfo />,
    );
    const result = renderer.getRenderOutput();
    t.is(result.type, 'div');
    t.deepEqual(
      result.props.children,
      <div style={demoStyles.swatchInfo}>
        background
        <br />
        {inverse.a}
        <br />
        {inverse.css.a}
      </div>,
    );
  });
  t.is(spyErrors.callCount, 0);

  t.notThrows(() => {
    mockPalette.inverted = false;
    mockPalette.prefix = 'z';
    const renderer = new ShallowRenderer();
    renderer.render(
      <RawPaletteSwatch palette={mockPalette} id="background" showInfo />,
    );
    const result = renderer.getRenderOutput();
    t.is(result.type, 'div');
    t.deepEqual(
      result.props.children,
      <div style={demoStyles.swatchInfo}>
        background
        <br />
        {normal.z}
        <br />
        {normal.css.z}
      </div>,
    );
  });
  t.is(spyErrors.callCount, 0);

  spyErrors.restore();
});
