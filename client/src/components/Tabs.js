import './Tabs.css';
import React, { PureComponent } from 'react';

export default class Tabs extends PureComponent {
  render() {
    const { props: { tabs, currentTab, onSelect } } = this;
    return (
      <ul className='Tabs flex flex--row flex-content-center'>
        {tabs.map(tab =>
          <li
            className={`Tabs-tab ${tab === currentTab ? 'is-selected' : ''}`}
            key={tab}
            onClick={() => { if (onSelect) onSelect(tab); }}
          >
            {tab}
          </li>
        )}
      </ul>
    );
  }
}
