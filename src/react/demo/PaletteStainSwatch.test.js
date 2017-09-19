import {test} from 'ava';
import sinon from 'sinon';
import React from 'react';
import PropTypes from 'prop-types';
import TestUtils from 'react-dom/test-utils';
import ShallowRenderer from 'react-test-renderer/shallow';
import {createConsoleErrorSpy} from '../../../test/helpers/console-utilities';
import PaletteProvider from '../PaletteProvider';
import PaletteStainSwatch from './PaletteStainSwatch';
import RawPaletteStainSwatch from './_/PaletteStainSwatch';
import demoStyles from './demo.styles';

const mockPalette = {
  subscribe: () => {},
  stains: {
    ps: '#ffffff',
    css: {
      ps: 'rgba(255,255,255)',
    },
  },
};

test('preflight', t => {
  t.is(typeof React, 'object');
  t.is(typeof PropTypes, 'object');
  t.is(typeof TestUtils, 'object');
  t.is(typeof PaletteStainSwatch, 'function');
});

test(t => {
  const palette = mockPalette;
  const spyErrors = createConsoleErrorSpy(sinon);
  const expectedErrors = [
    'Warning: Failed prop type: The prop `prefix` is marked as required',
    'Warning: Failed prop type: The prop `suffix` is marked as required',
  ];
  // requires prefix and suffix
  // won't throw but we can check errors with spy
  t.notThrows(() => {
    TestUtils.renderIntoDocument(
      <PaletteProvider palette={palette}>
        <PaletteStainSwatch />
      </PaletteProvider>,
    );
  });
  t.is(spyErrors.callCount, 2);
  t.true(spyErrors.errorCallContainsOneOf(expectedErrors, 0));
  t.true(spyErrors.errorCallContainsOneOf(expectedErrors, 1));
  spyErrors.reset();

  let tree;
  t.notThrows(() => {
    tree = TestUtils.renderIntoDocument(
      <PaletteProvider palette={palette}>
        <PaletteStainSwatch prefix="p" suffix="s" />
      </PaletteProvider>,
    );
  });
  t.is(spyErrors.callCount, 0);
  const child = TestUtils.findRenderedComponentWithType(
    tree,
    PaletteStainSwatch,
  );
  t.is(child.context.palette, palette);
  const vdomDiv = TestUtils.findRenderedDOMComponentWithTag(tree, 'div');
  /* eslint-disable no-underscore-dangle */
  const style = vdomDiv[Object.keys(vdomDiv)[0]]._previousStyle;
  t.is(style.background, mockPalette.stains.ps);
  /* eslint-enable no-underscore-dangle */
  spyErrors.reset();

  // with info inside
  t.notThrows(() => {
    tree = TestUtils.renderIntoDocument(
      <PaletteProvider palette={palette}>
        <PaletteStainSwatch prefix="p" suffix="s" showInfo />
      </PaletteProvider>,
    );
  });

  const vdomDivs = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'div');
  t.true(Array.isArray(vdomDivs));
  t.is(vdomDivs.length, 2);

  // to test render need to use the version
  // that hasn't been HOC connected
  t.notThrows(() => {
    const renderer = new ShallowRenderer();
    renderer.render(
      <RawPaletteStainSwatch
        palette={mockPalette}
        prefix="p"
        suffix="s"
        showInfo
      />,
    );
    const result = renderer.getRenderOutput();
    t.is(result.type, 'div');
    t.deepEqual(
      result.props.children,
      <div style={demoStyles.swatchInfo}>
        ps
        <br />
        #ffffff
        <br />
        rgba(255,255,255)
      </div>,
    );
  });

  spyErrors.restore();
});
