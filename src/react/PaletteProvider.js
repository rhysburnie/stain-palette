import React from 'react';
import PropTypes from 'prop-types';

class PaletteProvider extends React.PureComponent {
  /* eslint-disable react/forbid-prop-types */
  static propTypes = {
    palette: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
  };
  static childContextTypes = {
    palette: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.palette = props.palette;
  }

  getChildContext() {
    return {palette: this.palette};
  }

  // don't think this would be useful...
  // componentWillReceiveProps({palette}) {
  //   this.palette.update(palette);
  // }

  render() {
    return React.Children.only(this.props.children);
  }
}

export default PaletteProvider;
