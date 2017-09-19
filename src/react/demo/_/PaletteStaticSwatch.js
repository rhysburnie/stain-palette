import React from 'react';
import PropTypes from 'prop-types';
import demoStyles from '../demo.styles';

/* eslint-disable no-param-reassign */
const PaletteStaticSwatch = ({id, prefix, palette, showInfo, styles}) => {
  const restore = palette.prefix;
  palette.notificationsEnabled = false;
  palette.prefix = prefix;
  const hex = palette[id];
  let css;
  if (showInfo) {
    css = palette.css[id];
  }
  palette.prefix = restore;
  palette.notificationsEnabled = true;
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
/* eslint-enable no-param-reassign */

/* eslint-disable react/forbid-prop-types */
PaletteStaticSwatch.propTypes = {
  showInfo: PropTypes.bool,
  styles: PropTypes.object,
  palette: PropTypes.object.isRequired,
  prefix: PropTypes.string.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
PaletteStaticSwatch.defaultProps = {
  showInfo: false,
  styles: demoStyles,
};
/* eslint-enable react/forbid-prop-types */

export default PaletteStaticSwatch;
