import React, { Component } from 'react';
import './EventTimeline.css';
import ProbeEvents, { TYPE_SQL } from '../services/ProbeEvents';
import KeyIndex from '../utils/KeyIndex';

const MARGIN = 4;
const GROUP_MARGIN = MARGIN * 2;
const ROW_HEIGHT = 20;
const ROW_HEIGHT_WITH_MARGIN = ROW_HEIGHT + MARGIN * 2;
const VIEW_MARGIN = 10;

class Event extends Component {
  shouldComponentUpdate({ event, isSelected }){
    const { props } = this;
    return (
      event !== props.event
      || isSelected !== props.isSelected
    )
  }

  onClick = e => {
    const { onClick, event } = this.props;
    if (onClick) {
      e.stopPropagation();
      onClick(event.model);
    }
  }

  render() {
    const { event: { x, y, width, color, isCached, name }, isSelected} = this.props;
    return (
      <rect
        data-name={name}
        x={x} y={y}
        width={width}
        className={
          `EventTimeline-item ${
            isSelected ? 'is-selected' : ''
          } ${
            isCached ? 'is-cached' : ''
          }`
        }
        style={{ color }}
        fill={color}
        onClick={this.onClick}
      />
    );
  }
}

const Group = ({ group: { events, id, name, x, width }, onClick, selectedEvent, unscaledViewBox }) => (
  <g transform={`translate(${x})`}>
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
      <Event event={event} isSelected={selectedEvent === event.model} key={event.id} onClick={onClick} />
    )}
  </g>
)

class Groups extends Component {
  shouldComponentUpdate({ groups, selectedEvent, unscaledViewBox }) {
    const { props } = this;
    return (
       groups !== props.groups
    || unscaledViewBox !== props.unscaledViewBox
    || selectedEvent !== props.selectedEvent
    );
  }

  render() {
    const { groups, onClick, unscaledViewBox, selectedEvent } = this.props;
    return (
      <g>
        {groups.map(group =>
          <Group
            group={group}
            onClick={onClick}
            selectedEvent={selectedEvent}
            key={group.id}
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
    const { props: { unscaledViewBox, viewX, viewWidth } } = this;
    const dividerWidth = this.dividerWidth(viewWidth);
    const gridLines = [];
    const lastGridX = this.lastGridX(viewX, viewWidth);
    for (let x = this.firstGridX(viewX, viewWidth); x < lastGridX; x += dividerWidth) {
      gridLines.push(
        <g key={x} transform={`translate(${x})`}>
          <line
            className='EventTimeline-gridLine'
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
  );

const eventState = (model, min, offsetIndexer) => {
  const { type, id, isCached, name, time, duration, color } = model;
  const y = (
    type === TYPE_SQL
      // ? GROUP_MARGIN + (ROW_HEIGHT_WITH_MARGIN * (2 + offsetIndexer.getIndex(name) * 0.25))
      ? GROUP_MARGIN + (ROW_HEIGHT_WITH_MARGIN * (2 + offsetIndexer.getIndex(name) * 0.25))
      : GROUP_MARGIN + ROW_HEIGHT_WITH_MARGIN
  );
  return {
    name,
    id,
    model,
    width: Math.ceil(duration),
    x: time - min,
    y,
    color,
    isCached
  };
}

const groupState = (model, min) => {
  const { id, name, time, duration, events } = model;
  const offsetIndexer = new KeyIndex();
  return {
    name,
    id,
    model,
    width: Math.ceil(duration),
    x: time - min,
    events: events.map(e => eventState(e, time, offsetIndexer))
  };
}

const state = eventSets => {
  let min = Number.MAX_SAFE_INTEGER;
  let max = 0;

  for (let i = 0; i < eventSets.length; ++i) {
    const { time, duration } = eventSets[i];
    min = Math.min(time, min);
    max = Math.min(time + duration, max);
  }

  min -= VIEW_MARGIN;
  max += VIEW_MARGIN;

  return {
    eventSets,
    groups: eventSets.map(es => groupState(es, min)),
    min,
    max
  };
}

// Note(perf): Purposely a function type as instantation and access faster than
//             Object literal or Classes at the moment.
function VisibleElement(pct, event) {
  this.event = event;
  this.visibleDuration = pct * event.duration;
}

export default class EventTimeline extends Component {
  constructor() {
    super();
    this.state = {
      ...state([]),
      viewX: 0,
      viewWidth: 0,
      size: [ 0, 0 ],
      unscaledViewBox: '0 0 0 0',
      selectedEvent: null
    };

    ProbeEvents.on(this.handleEventsUpdated);
  }

  handleEventsUpdated = eventSets => {
    this.setState(state(eventSets), this.updateVisibleElements);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { eventSets, selectedEvent, viewX, viewWidth, unscaledViewBox } = this.state;
    return (
       eventSets !== nextState.eventSets
    || viewX !== nextState.viewX
    || viewWidth !== nextState.viewWidth
    || unscaledViewBox !== nextState.unscaledViewBox
    || selectedEvent !== nextState.selectedEvent
    || this.props.hoveredSql !== nextProps.hoveredSql
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

    const items = [];
    const { viewX, viewWidth, groups } = this.state;
    const maxX = viewX + viewWidth;
    let groupX, groupMaxX, x, width, model, events, j, pct;

    for(let i = 0; i < groups.length; ++i) {
      ({ model, x:groupX, width, events } = groups[i]);
      groupMaxX = groupX + width;
      pct = overlapPct(groupX, groupMaxX, viewX, maxX);

      if (pct > 0.0) {
        items.push(new VisibleElement(pct, model));

        if (pct === 1.0) {
          for(j = 0; j < events.length; ++j) {
            items.push(new VisibleElement(1.0, events[j].model));
          }
        }
        else {
          for(j = 0; j < events.length; ++j) {
            ({ model, x, width } = events[j]);
            x += groupX;
            pct = overlapPct(x, (x + width), viewX, maxX);
            if (pct > 0.0) {
              items.push(new VisibleElement(pct, model));
            }
          }
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

  onEventSelected = selectedEvent => {
    this.setState({ selectedEvent }, () => {
      const { onSelect } = this.props;
      if (typeof onSelect === 'function') {
        onSelect(selectedEvent);
      }
    });
  }

  onClearSelectedEvent = () => this.onEventSelected(null)

  render() {
    const { hoveredSql } = this.props;
    const {
      groups, max, min, selectedEvent, unscaledViewBox, viewX, viewWidth,
      size: [ width, height ]
    } = this.state;
    return (
      <div className='EventTimeline'>
        <iframe
          title='EventTimeline-resizeDetector'
          className='EventTimeline-resizeDetector'
          ref={this.onResizeDetectorMounted}
        />
        { hoveredSql &&
          <style>{`
            .EventTimeline-item {
              opacity: 0.25;
            }
            .EventTimeline-item[data-name='${hoveredSql}'] {
              opacity: 1;
              fill-opacity: 1;
              stroke: currentColor;
              stroke-opacity: 1;
            }
          `}</style>
        }
        <svg
          className='EventTimeline-svg'
          onWheel={this.onWheelEvent}
          preserveAspectRatio='none'
          viewBox={`${viewX} 0 ${viewWidth} ${height}`}
          width={width}
          height={height}
          onClick={this.onClearSelectedEvent}
        >
          <g transform='translate(0, 20)'>
            <Groups
              groups={groups}
              unscaledViewBox={unscaledViewBox}
              onClick={this.onEventSelected}
              selectedEvent={selectedEvent}
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
