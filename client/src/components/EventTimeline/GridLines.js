import './GridLines.css';
import React, { Component } from 'react';

const getDividerWidth = (viewWidth) => {
  const order = Math.log10(viewWidth / 3.0);
  const lowerOrder = Math.floor(order);
  // Determine whether divder width should be half step (ex. 5, 50, 500, ...)
  const result = Math.pow(10.0, lowerOrder) * (0.69897 < order - lowerOrder  ? 5.0 : 1.0);
  return Math.max(5.0, result);
}

const getFirstGridX = (viewX, dividerWidth) =>
  Math.ceil(viewX / dividerWidth) * dividerWidth;

const getLastGridX = (viewX, viewWidth, dividerWidth) =>
  Math.ceil((viewX + viewWidth) / dividerWidth) * dividerWidth;

class GridLine extends Component {
  shouldComponentUpdate({ unscaledViewBox, x }) {
    const { props } = this;
    return (
       unscaledViewBox !== props.unscaledViewBox
    || x !== props.x
    );
  }
  render() {
    const { unscaledViewBox, x } = this.props;
    return (
      <g transform={`translate(${x})`}>
        <line className='GridLine' x1='0' y1='0' x2='0' y2='100%'/>
        <svg preserveAspectRatio='none' viewBox={unscaledViewBox}>
          <text alignmentBaseline='hanging' x='5' y='5'>
            {x} ms
          </text>
        </svg>
      </g>
    );
  }
}

export default class GridLines extends Component {
  shouldComponentUpdate({ viewWidth, viewX, unscaledViewBox }) {
    const { props } = this;
    let dividerWidth, prevDividerWidth;
    return (
       unscaledViewBox !== props.unscaledViewBox
    || (dividerWidth = getDividerWidth(viewWidth)) !== (prevDividerWidth = getDividerWidth(props.viewWidth))
    || getFirstGridX(viewX, dividerWidth) !== getFirstGridX(props.viewX, prevDividerWidth)
    || getLastGridX(viewX, viewWidth, dividerWidth) !== getLastGridX(props.viewX, props.viewWidth, prevDividerWidth)
    );
  }

  render() {
    const { props: { unscaledViewBox, viewX, viewWidth } } = this;
    const dividerWidth = getDividerWidth(viewWidth);
    const gridLines = [];
    const lastGridX = getLastGridX(viewX, viewWidth, dividerWidth);
    for (let x = getFirstGridX(viewX, dividerWidth); x < lastGridX; x += dividerWidth) {
      gridLines.push(
        <GridLine key={x} x={x} unscaledViewBox={unscaledViewBox} />
      );
    }

    return <g>{gridLines}</g>;
  }
}
