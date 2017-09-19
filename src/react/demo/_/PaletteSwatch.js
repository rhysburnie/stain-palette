import React from 'react';
import PropTypes from 'prop-types';
import demoStyles from '../demo.styles';

const PaletteSwatch = ({id, palette, showInfo, styles}) => {
  const hex = palette[id];
  let css;
  if (showInfo) {
    css = palette.css[id];
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
PaletteSwatch.propTypes = {
  showInfo: PropTypes.bool,
  styles: PropTypes.object,
  palette: PropTypes.object.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
PaletteSwatch.defaultProps = {
  showInfo: false,
  styles: demoStyles,
};
/* eslint-enable react/forbid-prop-types */

export default PaletteSwatch;
