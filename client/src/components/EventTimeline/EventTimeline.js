import './EventTimeline.css';
import React, { Component } from 'react';
import GridLines from './GridLines';
import PortalDestination from './PortalDestination';
import ProbeEvents, { TYPE_SQL } from '../../services/ProbeEvents';

const MARGIN = 4;
const GROUP_MARGIN = MARGIN * 2;
const ROW_HEIGHT = 20;
const COUNT_HEIGHT_INCREMENT = ROW_HEIGHT / 4;
const ROW_HEIGHT_WITH_MARGIN = ROW_HEIGHT + MARGIN * 2;
const VIEW_MARGIN_MS = 10;

class Event extends Component {
  shouldComponentUpdate({ model, isSelected }){
    const { props } = this;
    return (
       model !== props.model
    || isSelected !== props.isSelected
    )
  }

  onClick = e => {
    const { onClick, model } = this.props;
    if (onClick) {
      e.stopPropagation();
      onClick(model);
    }
  }

  onMouseEnterLeave = ({ type }) => {
    const { onPortal, groupX, model } = this.props;
    if (type === 'mouseenter') {
      onPortal(
        <foreignObject width="400" height="100">
          <div className='EventTimeline-itemTooltip' style={{ borderColor: model.color }} >
            <div className='EventTimeline-itemTooltipBorder' style={{ backgroundColor: model.color }} />
            {model.name} {model.sql}
          </div>
        </foreignObject>,
        (groupX + this.x + this.width / 2),
        20 + this.y + this.height / 2
      );
    }
    else {
      onPortal(null, 0, 0);
    }
  }

  get width() { return this.props.model.durationCeil; }

  get x() {
    const { model, groupTime } = this.props;
    return model.time - groupTime;
  }

  get y() {
    return GROUP_MARGIN + ROW_HEIGHT_WITH_MARGIN + (
      this.props.model.type === TYPE_SQL
        ? ROW_HEIGHT_WITH_MARGIN
        : 0
    )
  }

  get height() { return ROW_HEIGHT + COUNT_HEIGHT_INCREMENT * this.props.model.count; }

  render() {
    const { model, groupTime, isSelected} = this.props;

    return (
      <g onMouseEnter={this.onMouseEnterLeave} onMouseLeave={this.onMouseEnterLeave} >
        <rect
          data-sqlhash={model.sqlHash}
          x={this.x} y={this.y}
          width={this.width}
          height={this.height}
          className={`
            EventTimeline-item
            ${isSelected ? 'is-selected' : ''}
            ${model.isCached ? 'is-cached' : ''}
          `}
          style={{ color: model.color }}
          fill={model.color}
          onClick={this.onClick}
        />
      </g>
    );
  }
}

const Group = ({ model, minX, onClick, onPortal, selectedEvent, unscaledViewBox }) => (
  <g transform={`translate(${model.time - minX})`}>
    <rect
      className='EventTimeline-item EventTimeline-item--group'
      width={model.durationCeil} height='20'
      x='0' y={GROUP_MARGIN}
    />
    <svg preserveAspectRatio='none' viewBox={unscaledViewBox}>
      <text className='EventTimeline-groupLabel' x='4' y={GROUP_MARGIN + 12 + 2}>
        {model.name}
      </text>
    </svg>
    {model.events.map(event =>
      <Event
        model={event}
        groupTime={model.time}
        groupX={model.time - minX}
        isSelected={selectedEvent === event}
        key={event.id}
        onClick={onClick}
        onPortal={onPortal}
      />
    )}
  </g>
)

class Groups extends Component {
  shouldComponentUpdate({ groups, minX, selectedEvent, unscaledViewBox }) {
    const { props } = this;
    return (
       groups !== props.groups
    || unscaledViewBox !== props.unscaledViewBox
    || selectedEvent !== props.selectedEvent
    || minX !== props.minX
    );
  }

  render() {
    const { groups, minX, onClick, onPortal, unscaledViewBox, selectedEvent } = this.props;
    return (
      <g transform='translate(0, 20)'>
        {groups.map(group =>
          <Group
            model={group}
            key={group.id}
            minX={minX}
            onClick={onClick}
            onPortal={onPortal}
            selectedEvent={selectedEvent}
            unscaledViewBox={unscaledViewBox}
          />
        )}
      </g>
    )
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

const eventState = (model, min) => {
  const { type, time, durationCeil, count } = model;
  const y = GROUP_MARGIN + ROW_HEIGHT_WITH_MARGIN + (
    type === TYPE_SQL
      ? ROW_HEIGHT_WITH_MARGIN
      : 0
  );
  return {
    model,
    width: durationCeil,
    height: ROW_HEIGHT + COUNT_HEIGHT_INCREMENT * count,
    x: time - min,
    y
  };
}

const groupState = (model, min) => {
  const { time, durationCeil, events } = model;
  return {
    model,
    width: durationCeil,
    x: time - min,
    events: events.map(e => eventState(e, time))
  };
}

const state = eventSets => {
  const min = Math.min(...eventSets.map(es => es.time)) - VIEW_MARGIN_MS;
  const max = Math.max(...eventSets.map(es => es.time + es.duration)) + VIEW_MARGIN_MS;
  return {
    eventSets,
    groups: eventSets.map(es => groupState(es, min)),
    maxViewWidth: max - min,
    minX: min
  };
}

export const VisibleElement = class {
  constructor(pct, event) {
    this.event = event;
    this.visibleDuration = pct * event.duration;
  }
}

export default class EventTimeline extends Component {
  state = {
    ...state([]),
    viewX: 0,
    viewWidth: 0,
    size: [ 0, 0 ],
    unscaledViewBox: '0 0 0 0',
    selectedEvent: null
  }

  componentDidMount(){ ProbeEvents.on(this.handleEventsUpdated); }
  componentWillUnmount(){ ProbeEvents.off(this.handleEventsUpdated); }

  handleEventsUpdated = eventSets => {
    this.setState(state(eventSets), this.updateVisibleElements);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { hoveredSql } = this.props;
    const { eventSets, selectedEvent, viewX, viewWidth, unscaledViewBox } = this.state;
    return (
    // State
       eventSets !== nextState.eventSets
    || viewX !== nextState.viewX
    || viewWidth !== nextState.viewWidth
    || unscaledViewBox !== nextState.unscaledViewBox
    || selectedEvent !== nextState.selectedEvent

    // Props
    || hoveredSql !== nextProps.hoveredSql
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
    // TODO: Remove dependency on groups and groups.events
    const { minX, viewX, viewWidth, groups } = this.state;
    const maxX = viewX + viewWidth;

    for(let i = 0; i < groups.length; ++i) {
      const { model, x:groupX, width, events } = groups[i];
      const pct = overlapPct(groupX, groupX + width, viewX, maxX);

      if (pct > 0.0) {
        items.push(new VisibleElement(pct, model));

        for(let j = 0; j < events.length; j++) {
          const { model:eventModel, x, width:eventWidth } = events[j];
          if (pct === 1.0) {
            items.push(new VisibleElement(1.0, eventModel));
          }
          else {
            const eventPct = overlapPct((x + groupX), (x + groupX + eventWidth), viewX, maxX);
            if (eventPct > 0.0) {
              items.push(new VisibleElement(eventPct, eventModel));
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
    const { maxViewWidth, viewX, viewWidth } = this.state;
    this.setState({
      viewX: (
        Math.min(
          (maxViewWidth - viewWidth),
          Math.max(0,
            viewX + (amt * this.viewToPixel)
          )
        )
      )
    }, this.updateVisibleElements);
  }

  scrollVert(amt, clientX) {
    const { viewToPixel, state: {maxViewWidth, viewX, viewWidth} } = this;

    // Scale zoom amount to the view
    const changeAmt = amt * viewToPixel;
    const viewClientX = clientX * viewToPixel;
    // Target ratio to maintain
    const ratio = viewClientX / viewWidth;

    const newViewWidth = (
      Math.max(
        20, // Prevent zooming in further than 20 ms
        Math.min(
          maxViewWidth, // Prevent zooming out further than all the data (max/min)
          changeAmt + viewWidth
        )
      )
    );
    let newViewX = viewX + (viewClientX - (ratio * newViewWidth));
    // If the right edge will go beyond the max, move the view left
    newViewX -= Math.max(0, newViewX + newViewWidth - maxViewWidth);

    this.setState({
      viewWidth: newViewWidth,
      viewX: Math.max(0, newViewX) // Prevent the left edge going past the min
    }, this.updateVisibleElements);
  }

  onPortalDestinationMounted = portalDestination => {
    this.portalDestination = portalDestination;
  }

  onResizeDetectorMounted = resizeDetector => {
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
  onWheelEvent = ({ nativeEvent }) => {
    const { deltaY, deltaX, clientX } = nativeEvent;
    nativeEvent.preventDefault();

    // Prevent scrolling and zooming at the same time.
    // Favor the operation that has most motion towards.
    if (deltaX !== 0 && Math.abs(deltaX / deltaY) > 2.0) this.scrollHoriz(deltaX);
    else this.scrollVert(deltaY, clientX);
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
  onMouseOver = ({ target }) => this.props.onHoverSql(target.dataset.sqlhash)
  onMouseOut = () => this.props.onHoverSql(null)
  onPortal = (traveler, x, y) => {
    this.portalDestination.setTraveler(traveler, x, y);
  }

  render() {
    const { hoveredSql } = this.props;
    const {
      eventSets, groups, max, min, minX, selectedEvent,
      unscaledViewBox, viewX, viewWidth, size: [ width, height ]
    } = this.state;

    return (
      <div className='EventTimeline'>
        <iframe
          title='EventTimeline-resizeDetector'
          className='EventTimeline-resizeDetector'
          ref={this.onResizeDetectorMounted}
        />
        <svg className='EventTimeline-containerSvg' onWheel={this.onWheelEvent} viewBox={unscaledViewBox} width={width} height={height}>
          <svg
            className='EventTimeline-svg'
            preserveAspectRatio='none'
            viewBox={`${viewX} 0 ${viewWidth} ${height}`}
            width={width}
            height={height}
            onClick={this.onClearSelectedEvent}
            onMouseOver={this.onMouseOver}
            onMouseOut={this.onMouseOut}
          >
            {/* TODO: Remove translate move it into the event/group positioning */}
            <Groups
              groups={eventSets}
              minX={minX}
              unscaledViewBox={unscaledViewBox}
              onClick={this.onEventSelected}
              selectedEvent={selectedEvent}
              onPortal={this.onPortal}
            />
            <GridLines
              min={min}
              max={max}
              viewWidth={viewWidth}
              viewX={viewX}
              unscaledViewBox={unscaledViewBox}
            />
            <PortalDestination
              ref={this.onPortalDestinationMounted}
              unscaledViewBox={unscaledViewBox}
            />
          </svg>
        </svg>
        {hoveredSql != null &&
          <style>{`
            .EventTimeline-item:not([data-sqlhash='${hoveredSql}']) {
              opacity: 0.1;
            }
            .EventTimeline-item.EventTimeline-item--group:not([data-sqlhash='${hoveredSql}']) {
              opacity: 1;
            }
            .EventTimeline-item[data-sqlhash='${hoveredSql}'] {
              stroke: currentColor;
            }
            .EventTimeline-item[data-sqlhash='${hoveredSql}']:hover {
              opacity: 1;
              stroke-opacity: 1;
              fill-opacity: 1;
            }
            .EventTimeline-item[data-sqlhash='${hoveredSql}'].is-cached {
              stroke-opacity: 0.5;
            }
          `}</style>
        }
      </div>
    );
  }
}
