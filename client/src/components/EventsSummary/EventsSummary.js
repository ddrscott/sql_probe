import '../../css/flex.css';
import './EventsSummary.css';
import React, { Component } from 'react';
import Tabs from '../Tabs';
import SummaryTab from './SummaryTab2';
import PivotTab from './PivotTab';

const TABS = [ 'Summary', 'Pivot' ];

export default class EventsSummary extends Component {
  constructor() {
    super();
    this.state = { currentTab: TABS[0] };
  }

  onTabSelect = currentTab => this.setState({ currentTab })

  renderCurrentTab() {
    switch(this.state.currentTab) {
      case 'Summary': return <SummaryTab {...this.props} />
      case 'Pivot':   return <PivotTab {...this.props} />
      default:        return null;
    }
  }

  render() {
    return (
      <div className='EventsSummary flex'>
        <Tabs
          tabs={TABS}
          currentTab={this.state.currentTab}
          onSelect={this.onTabSelect}
        />
        <div className='EventsSummary-tabContents flex-grow'>
          {this.renderCurrentTab()}
        </div>
      </div>
    );
  }
}
