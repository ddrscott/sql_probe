import '../../css/flex.css';
import React, { Component } from 'react';
import Tabs from '../Tabs';
import SummaryTab from './SummaryTab';
import PivotTab from './PivotTab';

const TABS = [ 'Summary', 'Pivot' ];

export default class extends Component {
  constructor() {
    super();
    this.handleTabSelect = this.handleTabSelect.bind(this);
    this.state = { currentTab: TABS[0] };
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
    return (
      <div className='flex'>
        <Tabs tabs={TABS} currentTab={ this.state.currentTab } onSelect={this.handleTabSelect} />
        {this.renderCurrentTab()}
      </div>
    );
  }
}
