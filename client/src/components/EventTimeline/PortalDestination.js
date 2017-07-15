import React, { Component } from 'react';

export default class PortalDestination extends Component {
  state = { traveler: null }

  setTraveler(traveler, x, y) { this.setState({ traveler, x, y }); }

  render(){
    const { unscaledViewBox } = this.props;
    const { traveler, x, y } = this.state;
    return (
      <g transform={(x !== undefined && y !== undefined) ? `translate(${x}, ${y})` : ''}>
        <svg preserveAspectRatio='none' viewBox={unscaledViewBox}>
          {traveler}
        </svg>
      </g>
    );
  }
};
