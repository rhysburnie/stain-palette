/**
 * Note: internally it uses the PaletteHOC
 *       wrapped PaletteStaticSwatch only
 *       the actual table can be shallowRender tested
 */
import React from 'react';
import PropTypes from 'prop-types';
import demoStyles from '../demo.styles';
// NOTE: the PaletteHOC version
import PaletteStainSwatch from '../PaletteStaticSwatch';

const getSuffixes = (options = {}) => {
  const suffixes = Object.keys(options.scale.bases);
  if (options.accent.bases) {
    Object.keys(options.accent.bases).forEach(key => suffixes.push(key));
  }
  return suffixes;
};

class PaletteStainsTable extends React.Component {
  /* eslint-disable react/forbid-prop-types */
  static propTypes = {
    showInfo: PropTypes.bool,
    styles: PropTypes.object,
    palette: PropTypes.object.isRequired,
  };

  static defaultProps = {
    showInfo: false,
    styles: demoStyles,
  };
  /* eslint-enable react/forbid-prop-types */

  render() {
    const {palette, showInfo, styles} = this.props;
    const suffixes = getSuffixes(palette.options);
    const countPrefixes = palette.stainPrefixes.length;
    return (
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.theadTh}>&nbsp;</th>
              <th style={styles.theadTh}>keys</th>
              <th style={styles.theadTh} colSpan={countPrefixes}>
                &nbsp;
              </th>
            </tr>
            <tr>
              <th style={styles.theadTh}>prefixes</th>
              <th style={styles.theadTh}>&nbsp;</th>
              {palette.stainPrefixes.map(prefix => (
                <th key={prefix} style={styles.theadTh}>
                  {prefix}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {suffixes.map(suffix => (
              <tr key={suffix}>
                <td style={styles.th}>&nbsp;</td>
                <th style={styles.td}>{suffix}</th>
                {palette.stainPrefixes.map(prefix => (
                  <td style={styles.td} key={prefix + suffix}>
                    <PaletteStainSwatch
                      prefix={prefix}
                      suffix={suffix}
                      showInfo={showInfo}
                      styles={styles}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default PaletteStainsTable;
