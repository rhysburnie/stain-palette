import React from 'react';
import PropTypes from 'prop-types';

export default function PaletteHOC(BaseComponent) {
  class PaletteWrapped extends React.PureComponent {
    static contextTypes = {
      palette: PropTypes.object.isRequired,
    };

    componentDidMount() {
      this.context.palette.subscribe(() => this.forceUpdate());
    }

    render() {
      return <BaseComponent {...this.props} palette={this.context.palette} />;
    }
  }
  return PaletteWrapped;
}
