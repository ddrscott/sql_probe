import React, { Component } from 'react';
import './App.css';
import EventDetails from './components/EventDetails';
import EventsSummary from './components/EventsSummary/EventsSummary';
import EventTimeline from './components/EventTimeline';
import PanelSplit from './components/PanelSplit';

export default class App extends Component {
  state = {
    hoveredSql: null,
    selectedEvent: null,
    visibleEvents: [],
  }

  handleSelect = selectedEvent => { this.setState({ selectedEvent }); }
  handleVisibleEventsChange = visibleEvents => { this.setState({ visibleEvents }); }
  onHoverSql = hoveredSql => { this.setState({ hoveredSql }); }

  render() {
    const { selectedEvent, visibleEvents, hoveredSql } = this.state;
    return (
      <div className='App'>
        {/* DEVELOPMENT ONLY: REMOVE ME */}
        {/* DEVELOPMENT ONLY: REMOVE ME */}
        {/* DEVELOPMENT ONLY: REMOVE ME */}
        {/*<img src='http://localhost:3000/people' width='1' height='1'/>*/}
        {/*<img src='http://localhost:3000/naughty/unbound_sql' width='1' height='1'/>*/}
        {/* DEVELOPMENT ONLY: REMOVE ME */}
        {/* DEVELOPMENT ONLY: REMOVE ME */}
        {/* DEVELOPMENT ONLY: REMOVE ME */}
        <PanelSplit
          initialSize={250}
          a={height =>
            <EventTimeline
              onSelect={this.handleSelect}
              onVisibleChange={this.handleVisibleEventsChange}
              hoveredSql={hoveredSql}
              onHoverSql={this.onHoverSql}
            />
          }
          b={
            selectedEvent
              ? <EventDetails event={selectedEvent} />
              : <EventsSummary
                  visibleEvents={visibleEvents}
                  onHoverSql={this.onHoverSql}
                  hoveredSql={hoveredSql}
                />
          }
        />
      </div>
    )
  }
}
