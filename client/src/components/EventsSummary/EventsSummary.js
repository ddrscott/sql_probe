import '../../css/flex.css';
import React, { Component } from 'react';
import Tabs from '../Tabs';
import SummaryTab from './SummaryTab';
import PivotTab from './PivotTab';

const STORAGE_KEY = 'EventsSummary.state';
const TABS = [ 'Summary', 'Pivot' ];

export default class extends Component {
  constructor() {
    super();
    this.handleTabSelect = this.handleTabSelect.bind(this);
    this.state = this.loadState();
  }

  saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  }

  // TODO: verify tab is valid, otherwise reset
  loadState() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : this.resetState();
  }

  resetState() {
     return { currentTab: TABS[0] };
  }

  handleTabSelect(currentTab) {
    this.setState({ currentTab });
  }

  renderCurrentTab() {
    switch(this.state.currentTab) {
      case 'Summary': return <SummaryTab {...this.props} />
      case 'Pivot':   return <PivotTab {...this.props} />
      default:        return null;
    }
  }

  render() {
    // TODO: is this the best place to save state?
    this.saveState();

    return (
      <div className='flex'>
        <Tabs tabs={TABS} currentTab={ this.state.currentTab } onSelect={this.handleTabSelect} />
        {this.renderCurrentTab()}
      </div>
    );
  }
}
