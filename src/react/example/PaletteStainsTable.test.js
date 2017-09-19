import {test} from 'ava';
import React from 'react';
import PropTypes from 'prop-types';
import TestUtils from 'react-dom/test-utils';
import {render} from 'enzyme';
import PaletteProvider from '../PaletteProvider';
import PaletteStainsTable from './PaletteStainsTable';
// Use an actual palette for this test
import demoPalette from './demo.palette';

test('preflight', t => {
  t.is(typeof React, 'object');
  t.is(typeof PropTypes, 'object');
  t.is(typeof TestUtils, 'object');
  t.is(typeof PaletteStainsTable, 'function');
});

test(t => {
  const palette = demoPalette;
  let tree;
  t.notThrows(() => {
    tree = TestUtils.renderIntoDocument(
      <PaletteProvider palette={palette}>
        <PaletteStainsTable />
      </PaletteProvider>,
    );
  });
  const child = TestUtils.findRenderedComponentWithType(
    tree,
    PaletteStainsTable,
  );
  t.is(child.context.palette, palette);

  const markup = render(
    <PaletteProvider palette={palette}>
      <PaletteStainsTable />
    </PaletteProvider>,
  );

  t.is(markup.find('div > table').length, 1);
  // header has 2 rows
  t.is(markup.find('thead tr').length, 2);
  const countPrefixes = palette.stainPrefixes.length;
  // the first header rows 3rd th will have colspan of that length
  t.is(
    markup.find('thead tr:first-child th:last-child').attr('colspan'),
    countPrefixes.toString(),
  );
  // the 2nd header row will have 2 + countPrefixes th's
  t.is(markup.find('thead tr:last-child th').length, 2 + countPrefixes);
  const countSuffixes =
    Object.keys(palette.options.scale.bases).length +
    Object.keys(palette.options.accent.bases).length;
  // has tbody row for each suffix
  t.is(markup.find('tbody tr').length, countSuffixes);
  // a div exists in a td for each prefix + suffix combo
  t.is(markup.find('td > div').length, countPrefixes * countSuffixes);
});
