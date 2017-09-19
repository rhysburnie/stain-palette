import {test} from 'ava';
import sinon from 'sinon';
import React from 'react';
import PropTypes from 'prop-types';
import TestUtils from 'react-dom/test-utils';
import PaletteProvider from './PaletteProvider';
import PaletteHOC from './PaletteHOC';
import {createConsoleErrorSpy} from '../../test/helpers/console-utilities';

test('preflight', t => {
  t.is(typeof React, 'object');
  t.is(typeof PropTypes, 'object');
  t.is(typeof TestUtils, 'object');
  t.is(typeof PaletteProvider, 'function');
  t.is(typeof PaletteHOC, 'function');
  t.is(PaletteProvider.propTypes.palette, PropTypes.object.isRequired);
  t.is(PaletteProvider.childContextTypes.palette, PropTypes.object.isRequired);
});

const mockPalette = {subscribe: () => {}};

const createMockChild = () => {
  /* eslint-disable react/prefer-stateless-function */
  class Child extends React.Component {
    static contextTypes = PaletteProvider.childContextTypes;
    render() {
      return <div />;
    }
  }

  Child.contextTypes = PaletteProvider.childContextTypes;

  return Child;
};

test('PaletteProvider: should enforce single child', t => {
  const palette = mockPalette;
  t.notThrows(() => {
    TestUtils.renderIntoDocument(
      <PaletteProvider palette={palette}>
        <div />
      </PaletteProvider>,
    );
  });
  t.throws(() => {
    TestUtils.renderIntoDocument(<PaletteProvider />);
  });
  t.throws(() => {
    TestUtils.renderIntoDocument(
      <PaletteProvider palette={palette}>
        <div />
        <div />
      </PaletteProvider>,
    );
  });
});

test('PaletteProvider: should add palette to the child context', t => {
  const spyError = createConsoleErrorSpy(sinon);
  // creates spyError on console.log with and additional
  // spy method: spyError.errorCallContainsOneOf

  const palette = mockPalette;
  const MockChild = createMockChild();
  // while this wont throw
  // it should log errors (we test that with spy)
  t.notThrows(() => {
    TestUtils.renderIntoDocument(
      <PaletteProvider>
        <MockChild />
      </PaletteProvider>,
    );
  });
  const expectedSupressedErrors = [
    'Warning: Failed child context type',
    'Warning: Failed context type',
  ];
  t.true(spyError.errorCallContainsOneOf(expectedSupressedErrors, 0));
  t.true(spyError.errorCallContainsOneOf(expectedSupressedErrors, 1));
  t.is(spyError.callCount, 2);
  spyError.reset();

  let tree;
  t.notThrows(() => {
    tree = TestUtils.renderIntoDocument(
      <PaletteProvider palette={palette}>
        <MockChild />
      </PaletteProvider>,
    );
  });
  t.is(spyError.callCount, 0);
  const child = TestUtils.findRenderedComponentWithType(tree, MockChild);
  t.is(child.context.palette, palette);
  spyError.restore();
});

test('PaletteHOC: ', t => {
  const palette = mockPalette;
  const spySubscribe = sinon.spy(palette, 'subscribe');
  const Child = PaletteHOC(() => <div />);
  t.is(Child.contextTypes.palette, PaletteProvider.childContextTypes.palette);
  const tree = TestUtils.renderIntoDocument(
    <PaletteProvider palette={palette}>
      <Child />
    </PaletteProvider>,
  );
  t.is(spySubscribe.callCount, 1);
  const child = TestUtils.findRenderedComponentWithType(tree, Child);
  t.is(child.context.palette, palette);
});
