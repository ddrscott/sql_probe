import React, { Component } from 'react';
import './PanelSplit.css';
import { DraggableCore } from 'react-draggable';

const renderPanel = (p, size) =>
  typeof p === 'function' ? p(size) : p;

export default class extends Component {
  constructor({ initialSize = 300 }){
    super();
    this.state = {
      size: initialSize,
      startDragPos: 0,
      startDragSize: 0
    };
  }

  get isVertical() { return this.props.orientation !== 'horizontal'; }
  get flexDirection() { return this.isVertical ? 'column' : 'row' }
  get sizeAttr() { return this.isVertical ? 'height' : 'width' }
  get eventAttr() { return this.isVertical ? 'screenY' : 'screenX' }

  handleDragStart = ({ [this.eventAttr]: pos }) => {
    this.setState({
      startDragPos: pos,
      startDragSize: this.state.size
    })
  }

  handleDrag = ({ [this.eventAttr]: pos }) => {
    const { startDragSize, startDragPos } = this.state;
    const size = startDragSize - startDragPos + pos;
    this.setState({ size });
  }

  render() {
    const { props: { a, b }, state: { size }, isVertical } = this;
    return (
      <div className='PanelSplit' style={{flexDirection: this.flexDirection}}>
        <div className='PanelSplit-a' style={{ [this.sizeAttr]: size }}>
          {renderPanel(a, size)}
        </div>
        <DraggableCore onStart={this.handleDragStart} onDrag={this.handleDrag}>
          <div className={`PanelSplit-resizer ${isVertical ? '' : 'PanelSplit-resizer--horizontal'}`}></div>
        </DraggableCore>
        <div className='PanelSplit-b'>
          {renderPanel(b, size)}
        </div>
      </div>
    );
  }
}
