import React, { Component } from 'react';
import './EventTimeline.css';
import ProbeEvents from '../services/ProbeEvents';
import 'vis/dist/vis-timeline-graph2d.min.css';
import { DataSet, Timeline } from 'vis/dist/vis-timeline-graph2d.min.js';

const flatten = arr => [].concat(...arr);

export default class extends Component {
  constructor() {
    super();

    this.handleEventsUpdated = eventSets => {
      this.setState({ eventSets }, () => {
        this.timeline.focus(eventSets[0].start_time);
        this.timeline.fit();
      });
    };
    ProbeEvents.on(this.handleEventsUpdated);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleVisibleEventsChanged = this.handleVisibleEventsChanged.bind(this);
    this.state = { eventSets: ProbeEvents.events, visibleEventIds: [] };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.eventSets !== this.state.eventSets;
  }

  componentDidMount() {
    this.timeline = new Timeline(this.root);
    this.timeline.setOptions({
      height: '100%',
      stack: false,
      showMinorLabels: false,
      // sensible scrolling
      horizontalScroll: true,
      verticalScroll: true,
      zoomKey: 'ctrlKey',
      zoomMin: 1000,             // one second in millis
      zoomMax: 1000 * 60 * 60,   // about an hour in millis
      orientation: {
        axis: 'bottom',
        item: 'top'
      },
      showCurrentTime: false,
      margin: {
        axis: 10,
        item: {
          horizontal: 0,
          vertical: 10
        }
      }
    });
    this.timeline.on('select', this.handleSelect);
    this.timeline.on('changed', this.handleVisibleEventsChanged)
    this.componentDidUpdate();
  }

  findEvent(id) {
    return this.events.find(e => e.id === id);
  }

  findEventSet(id) {
    return this.state.eventSets.find(e => e.id === id);
  }

  handleVisibleEventsChanged() {
    const { onVisibleChange } = this.props;
    if (onVisibleChange !== undefined) {
      const events = this.timeline.getVisibleItems()
                      .map(item => this.findEvent(item) || this.findEventSet(item))
                      .filter(event => {
                        return event !== undefined;
                      });
      const { visibleEventIds: prevVisibleEventIds } = this.state;
      const visibleEventIds = events.map(e => e.id);

      // Has the set of visible events changed?
      const newEvents = new Set(visibleEventIds);
      if (newEvents.size > 0 || visibleEventIds.length !== prevVisibleEventIds.length) {
        this.setState({ visibleEventIds });
        onVisibleChange(events);
      }
    }
  }

  handleSelect({ items }) {
    if (this.props.onSelect) {
      const event = this.findEvent(items[0]);
      setTimeout(() => this.props.onSelect(event), 0);
    }
  }

  get timelineItems() {
    const { eventSets } = this.state;
    return new DataSet(
      flatten(
        eventSets.map(eventSet => {
          const { color, end, events, name, time } = eventSet;
          return [
            {
              id: eventSet.id,
              start: time,
              end: end,
              content: name,
              group: 'Rails Controller',
              className: 'EventTimeline-eventSet',
              align: 'center',
              style: `border: none; background-color: ${color}`
            },
            ...events.map(e => ({
              id: e.id,
              start: e.time,
              end: e.end,
              group: e.name,
              className: 'EventTimeline-event',
              style: `border: none; background-color: ${e.color};`
            }))
          ]
        })
      )
    );
  }

  get events() {
    return flatten(this.state.eventSets.map(({ events }) => events));
  }

  get timelineGroups() {
    const groupSet = new Set(this.events.map(e => e.sql || e.name));
    const groups = new DataSet();
    groups.add({
      id: 'Rails Controller',
      content: 'Rails Controller Endpoint',
      style: 'opacity: 0.5'
    });
    for (let key of groupSet.keys()) {
      groups.add({ id: key, content: key.slice(0, 30) });
    }
    return groups;
  }

  componentDidUpdate() {
    this.timeline.setItems(this.timelineItems);
    this.timeline.setGroups(this.timelineGroups);
  }

  componentWillUnmount() {
    ProbeEvents.off(this.handleEventsUpdated);
    // TODO: cleanup the Timeline
  }

  render() {
    return (
      <div
        className='EventTimeline'
        style={{ height: '100%' }}
        ref={root => this.root = root}
      />
    );
  }
}
