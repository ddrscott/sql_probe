import React, { Component } from 'react';
import './App.css';
import EventDetails from './components/EventDetails';
import EventsSummary from './components/EventsSummary/EventsSummary';
import EventTimeline from './components/EventTimeline';
import PanelSplit from './components/PanelSplit';

export default class extends Component {
  constructor(){
    super();
    this.handleSelect = this.handleSelect.bind(this);
    this.handleVisibleEventsChange = this.handleVisibleEventsChange.bind(this);
    this.state = {
      selectedEvent: undefined,
      visibleEvents: []
    };
  }

  handleSelect(selectedEvent) { this.setState({ selectedEvent }); }
  handleVisibleEventsChange(visibleEvents) {
    this.setState({ visibleEvents });
  }

  render() {
    const { selectedEvent, visibleEvents } = this.state;
    return (
      <div className='App'>
        <img src='http://localhost:3000/people?month=2017-06-01' width='1' height='1'/>
        <PanelSplit
          a={height =>
            <EventTimeline
              onSelect={this.handleSelect}
              onVisibleChange={this.handleVisibleEventsChange}
            />
          }
          b={
            selectedEvent
              ? <EventDetails event={selectedEvent} />
              : <EventsSummary visibleEvents={visibleEvents} />
          }
        />
      </div>
    )
  }
}
