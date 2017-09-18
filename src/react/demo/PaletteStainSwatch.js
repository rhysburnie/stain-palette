import React from 'react';
import PropTypes from 'prop-types';
import PaletteHOC from '../PaletteHOC';
import demoStyles from './demo.styles';

const PaletteStainSwatch = ({prefix, suffix, palette, showInfo, styles}) => {
  const id = prefix + suffix;
  const hex = palette.stains[id];
  if (!hex) {
    return (
      <div>
        {showInfo ? (
          <div
            style={{
              ...styles.swatchInfo,
              display: 'inline-block',
            }}
          >
            (none)
          </div>
        ) : null}
      </div>
    );
  }
  let css;
  if (showInfo) {
    css = palette.stains.css[id];
  }
  return (
    <div style={{background: hex}}>
      {showInfo ? (
        <div style={styles.swatchInfo}>
          {id}
          <br />
          {hex}
          <br />
          {css}
        </div>
      ) : null}
    </div>
  );
};

/* eslint-disable react/forbid-prop-types */
PaletteStainSwatch.propTypes = {
  showInfo: PropTypes.bool,
  styles: PropTypes.object,
  palette: PropTypes.object.isRequired,
  prefix: PropTypes.string.isRequired,
  suffix: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
PaletteStainSwatch.defaultProps = {
  showInfo: false,
  styles: demoStyles,
};
/* eslint-enable react/forbid-prop-types */

export default PaletteHOC(PaletteStainSwatch);
