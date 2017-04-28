import React, { Component } from 'react';
import './App.css';
import EventTimeline from './components/EventTimeline';
import EventDetails from './components/EventDetails';
import PanelSplit from './components/PanelSplit';

export default class extends Component {
  constructor(){
    super();
    this.handleSelect = this.handleSelect.bind(this);
    this.state = {
      selectedEvent: undefined
    };
  }

  handleSelect(selectedEvent) { this.setState({ selectedEvent }); }

  render() {
    const { selectedEvent } = this.state;
    return (
      <div className='App'>
        <PanelSplit
          a={height =>
            <EventTimeline onSelect={this.handleSelect} />
          }
          b={<EventDetails event={selectedEvent} />}
        />
      </div>
    )
  }
}
