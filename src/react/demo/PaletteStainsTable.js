import React from 'react';
import PropTypes from 'prop-types';
import PaletteHOC from '../PaletteHOC';
import demoStyles from './demo.styles';
import PaletteStainSwatch from './PaletteStaticSwatch';

const getSuffixes = (options = {}) => {
  const suffixes = Object(options.scale.bases).keys();
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

  shouldComponentUpdate(nextProps) {
    // limit re-render to almost never
    const palette = this.props.palette;
    let shouldUpdate =
      nextProps.stainPrefixes.length !== palette.stainPrefixes.length;

    if (!shouldUpdate) {
      const suffixes = getSuffixes(palette.options);
      const nextSuffixes = getSuffixes(nextProps.palette.options);
      shouldUpdate = nextSuffixes.length !== suffixes.length;
    }

    return shouldUpdate;
  }

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

export default PaletteHOC(PaletteStainsTable);
