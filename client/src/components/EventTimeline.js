import React, { Component } from 'react';
import './EventTimeline.css';
import ProbeEvents from '../services/ProbeEvents';
import 'vis/dist/vis-timeline-graph2d.min.css';
import { DataSet, Timeline } from 'vis/dist/vis-timeline-graph2d.min.js';

const flatten = arr => [].concat(...arr);

// TODO: Replace new event id
const eventId = e =>
  `${e.time}:${e.transaction_id}:${e.duration}`

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
    this.state = { eventSets: ProbeEvents.events };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.eventSets !== this.state.eventSets;
  }

  componentDidMount() {
    this.timeline = new Timeline(this.root);
    this.timeline.setOptions({
      height: '100%',
      stack: false,
      // sensible scrolling
      horizontalScroll: true,
      verticalScroll: true,
      zoomKey: 'ctrlKey',
      zoomMin: 1000,             // one second in millis
      zoomMax: 1000 * 60 * 60,   // about an hour in millis
      orientation: {
        axis: 'bottom',
        item: 'top'
      }
    });
    this.timeline.on('select', this.handleSelect);
    this.componentDidUpdate();
  }

  handleSelect({ items }) {
    if (this.props.onSelect) {
      const event = this.events.find(e => eventId(e) === items[0]);
      setTimeout(() => this.props.onSelect(event), 0);
    }
  }

  get timelineItems() {
    const { eventSets } = this.state;
    return new DataSet(
      flatten(
        eventSets.map(({ duration, start_time, params: { controller, action }, events }) => [
          {
            id: start_time,
            start: (start_time*1000.0),
            end: (start_time*1000.0 + duration),
            content: `${controller}#${action}`,
            type: 'background',
            className: 'EventTimeline-eventSet',
            align: 'center'
          },
          ...events.map(e => ({
            id: eventId(e),
            start: Date.parse(e.time),
            end: Date.parse(e.end),
            group: (e.sql || e.name)
          }))
        ])
      )
    );
  }

  get events() {
    return flatten(this.state.eventSets.map(({ events }) => events));
  }

  get timelineGroups() {
    const groupSet = new Set(this.events.map(e => e.sql || e.name));
    const groups = new DataSet();
    for (let key of groupSet.keys()) {
      groups.add({ id: key, content: key.slice(0, 30), style: 'font-size: 12px' });
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
