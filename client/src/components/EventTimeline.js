import React, { Component } from 'react';
import './EventTimeline.css';
import ProbeEvents from '../services/ProbeEvents';
import colorWheelHue from '../utils/colorWheelHue';
import KeyIndex from '../utils/KeyIndex';

const MARGIN = 4;
const GROUP_MARGIN = MARGIN * 2;
const ROW_HEIGHT = 20;
const VIEW_MARGIN = 10;

const eventState = (event, min, colorIndexer, offsetIndexer) => {
  const { id, name, time, duration } = event;
  const colorIndex = colorIndexer.getIndex(name);
  const offsetIndex = offsetIndexer.getIndex(name);
  return {
    name,
    id,
    model: event,
    width: Math.ceil(duration),
    x: time - min,
    y: ((2 * MARGIN + ROW_HEIGHT) * offsetIndex + GROUP_MARGIN),
    colorHue: colorWheelHue(colorIndex - 1)
  };
}

const groupState = (eventSet, min, colorIndexer) => {
  const { id, name, time, duration, events } = eventSet;
  const offsetIndexer = new KeyIndex();
  return {
    name,
    id,
    model: eventSet,
    width: Math.ceil(duration),
    x: time - min,
    events: events.map(e => eventState(e, time, colorIndexer, offsetIndexer))
  };
}

const state = eventSets => {
  const colorIndexer = new KeyIndex();
  let min = Number.MAX_SAFE_INTEGER;
  let max = 0;

  for (let i = 0; i < eventSets.length; ++i) {
    const es = eventSets[i];
    const time = es.time;
    const endTime = time + es.duration;

    min = Math.min(time, min);
    max = Math.min(endTime, max);
  }

  min -= VIEW_MARGIN;
  max += VIEW_MARGIN;

  return {
    eventSets,
    groups: eventSets.map(es => groupState(es, min, colorIndexer)),
    min,
    max
  };
}

class Event extends Component {
  shouldComponentUpdate({ event }){
    return event !== this.props.event;
  }
  render() {
    const { id, x, y, width, colorHue } = this.props.event;
    return (
      <rect
        id={id}
        x={x} y={y}
        width={width}
        className='EventTimeline-item'
        fill={`hsl(${colorHue}, 80%, 60%)`}
      />
    );
  }
}

const Group = ({ group: { events, id, name, x, width }, unscaledViewBox }) => (
  <g transform={`translate(${x})`} id={id}>
    <rect
      className='EventTimeline-item EventTimeline-item--group'
      width={width}
      x='0' y={GROUP_MARGIN}
    />
    <svg preserveAspectRatio='none' viewBox={unscaledViewBox}>
      <text x='4' y={GROUP_MARGIN + 12 + 2} fontSize={12}>
        {name}
      </text>
    </svg>
    {events.map(event =>
      <Event key={event.id} event={event} />
    )}
  </g>
)

class Groups extends Component {
  shouldComponentUpdate({ groups, unscaledViewBox }) {
    const { props } = this;
    return (
       groups !== props.groups
    || unscaledViewBox !== props.unscaledViewBox
    );
  }

  render() {
    const { groups, unscaledViewBox } = this.props;
    return (
      <g>
        {groups.map(group =>
          <Group
            key={group.id}
            group={group}
            unscaledViewBox={unscaledViewBox}
          />
        )}
      </g>
    )
  }
}

class GridLines extends Component {
  shouldComponentUpdate({ max, min, viewWidth, viewX, unscaledViewBox }) {
    const { props } = this;
    return (
       max !== props.max
    || min !== props.min
    || unscaledViewBox !== props.unscaledViewBox
    || this.dividerWidth(viewWidth) !== this.dividerWidth(props.viewWidth)
    || this.firstGridX(viewX, viewWidth) !== this.firstGridX(props.viewX, props.viewWidth)
    || this.lastGridX(viewX, viewWidth) !== this.lastGridX(props.viewX, props.viewWidth)
    );
  }

  dividerWidth(viewWidth) {
    return (
      viewWidth / 1000 >= 3.0 ? 1000
    : viewWidth /  500 >= 3.0 ?  500
    : viewWidth /  100 >= 3.0 ?  100
    : viewWidth /   50 >= 3.0 ?   50
    : 10
    )
  }

  firstGridX(viewX, viewWidth) {
    const dividerWidth = this.dividerWidth(viewWidth);
    return Math.ceil(viewX / dividerWidth) * dividerWidth;
  }

  lastGridX(viewX, viewWidth) {
    const dividerWidth = this.dividerWidth(viewWidth);
    return Math.ceil((viewX + viewWidth) / dividerWidth) * dividerWidth;
  }

  render() {
    const { props: { min, max, unscaledViewBox, viewX, viewWidth } } = this;
    const dividerWidth = this.dividerWidth(viewWidth);
    const gridLines = [];
    const end = max - min;
    const viewMax = viewX + viewWidth;
    const lastGridX = this.lastGridX(viewX, viewWidth);
    for (let x = this.firstGridX(viewX, viewWidth); x < lastGridX; x += dividerWidth) {
      gridLines.push(
        <g key={x} transform={`translate(${x})`}>
          <line
            className='EventTimeline-gridLine'
            vectorEffect='non-scaling-stroke'
            x1='0' y1='0'
            x2='0' y2='100%'
          />
          <svg preserveAspectRatio='none' viewBox={unscaledViewBox}>
            <text
              alignmentBaseline='hanging'
              className='EventTimeline-gridLineLabel'
              x='5' y='5'
            >
              {x} ms
            </text>
          </svg>
        </g>
      );
    }

    return <g>{gridLines}</g>;
  }
}

const overlapPct = (x1, x2, y1, y2) =>
  Math.min(
    1.0,
    Math.max(
      0.0,
      Math.min(y2, x2) - Math.max(x1, y1)
    ) / (x2 - x1)
  )

export default class extends Component {
  constructor() {
    super();
    this.state = {
      ...state([]),
      viewX: 0,
      viewWidth: 0,
      size: [ 0, 0 ],
      unscaledViewBox: '0 0 0 0'
    };

    ProbeEvents.on(this.handleEventsUpdated);
  }

  handleEventsUpdated = eventSets => {
    this.setState(state(eventSets));
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { eventSets, viewX, viewWidth, unscaledViewBox } = this.state;
    return (
       eventSets !== nextState.eventSets
    || viewX !== nextState.viewX
    || viewWidth !== nextState.viewWidth
    || unscaledViewBox !== nextState.unscaledViewBox
    );
  }

  // The number of pixels for one unit in the view
  get viewToPixel() {
    const { size: [ width ], viewWidth } = this.state;
    return viewWidth / width;
  }

  updateVisibleElements = () => {
    const { onVisibleChange } = this.props;
    if ( typeof onVisibleChange !== 'function' ) return;

    let items = [];
    const { viewX, viewWidth, groups } = this.state;
    const maxX = viewX + viewWidth;
    let groupX, groupMaxX, x, width, model, events, j, pct;

    for(let i = 0; i < groups.length; ++i) {
      ({ model, x:groupX, width, events } = groups[i]);
      groupMaxX = groupX + width;
      pct = overlapPct(groupX, groupMaxX, viewX, maxX);
      if (pct === 0.0) continue;

      items.push({ pct, event: model });
      if (pct === 1.0) {
        for(j = 0; j < events.length; ++j) {
          items.push({ pct: 1.0, event: events[j].model });
        }
        continue;
      }

      for(j = 0; j < events.length; ++j) {
        ({ model, x, width } = events[j]);
        x += groupX;
        pct = overlapPct(x, (x + width), viewX, maxX);
        if (pct > 0.0) {
          items.push({ pct, event: model });
        }
      }
    }

    onVisibleChange(items);
  }

  updateSize = () => {
    if (this.resizeDetector === undefined) return;

    const { width, height } = this.resizeDetector.getBoundingClientRect();
    const { viewToPixel } = this;
    this.setState({
      viewWidth: width * (viewToPixel || 1.0),
      size: [ width, height ],
      unscaledViewBox: `0 0 ${width} ${height}`
    });
  }


  scrollHoriz(amt) {
    const { min, max, size: [ width ], viewX } = this.state;
    this.setState({
      viewX: (
        Math.min(
          Math.max(width, max - min - width),
          Math.max(0,
            viewX + (amt * this.viewToPixel)
          )
        )
      )
    }, this.updateVisibleElements);
  }

  scrollVert(amt) {
    this.setState({
      viewWidth: (
        Math.min(4000,  // Max Zoom Out (4 seconds)
          Math.max(100, // Max Zoom In (100 ms)
            this.state.viewWidth + amt * this.viewToPixel
          )
        )
      )
    }, this.updateVisibleElements);
  }

  onWheelEvent = ({ nativeEvent }) => {
    const { deltaY, deltaX } = nativeEvent;
    nativeEvent.stopPropagation();
    nativeEvent.stopImmediatePropagation();
    nativeEvent.preventDefault();

    // Prevent scrolling and zooming at the same time.
    // Favor the operation that has most motion towards.
    if (deltaX !== 0 && Math.abs(deltaX / deltaY) > 2.0) this.scrollHoriz(deltaX);
    else this.scrollVert(deltaY);
  }

  onResizeDetectorMounted = (resizeDetector) => {
    const prev = this.resizeDetector;
    this.resizeDetector = resizeDetector;
    if (resizeDetector) {
      resizeDetector.contentWindow.addEventListener('resize', this.updateSize);
      this.updateSize();
    }
    else {
      prev.contentWindow.removeEventListener('resize', this.updateSize);
    }
  }

  render() {
    const { groups, max, min, viewX, viewWidth, unscaledViewBox, size: [ width, height ] } = this.state;
    return (
      <div className='EventTimeline'>
        <iframe
          className='EventTimeline-resizeDetector'
          ref={this.onResizeDetectorMounted}
        />
        <svg
          className='EventTimeline-svg'
          onWheel={this.onWheelEvent}
          preserveAspectRatio='none'
          viewBox={`${viewX} 0 ${viewWidth} ${height}`}
          width={width}
          height={height}
        >
          <g transform='translate(0, 20)'>
            <Groups
              groups={groups}
              unscaledViewBox={unscaledViewBox}
            />
          </g>
          <GridLines
            min={min}
            max={max}
            viewWidth={viewWidth}
            viewX={viewX}
            unscaledViewBox={unscaledViewBox}
          />
        </svg>
      </div>
    );
  }
}
