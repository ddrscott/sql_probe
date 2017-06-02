import './SummaryTab.css';
import React from 'react';
import {
  COLOR_ACTIVE_RECORD, COLOR_SQL, COLOR_OTHER,
  TYPE_ACTIVE_RECORD, TYPE_SQL, TYPE_CONTROLLER
} from '../../services/ProbeEvents';
import Breakdown from './Breakdown';

const sumValue = items => items.reduce((sum, { value }) => sum + value, 0.0);
const compareValue = ({ value: a }, { value: b }) => b - a;

const byType = (events=[]) => {
  if (events.length === 0) return [];

  let ar = 0;
  let sql = 0;
  let c = 0;

  for (let i = 0; i < events.length; ++i) {
    const { visibleDuration, event: { type } } = events[i];

    if (type === TYPE_SQL)                sql += visibleDuration;
    else if (type === TYPE_ACTIVE_RECORD) ar  += visibleDuration;
    else if (type === TYPE_CONTROLLER)    c   += visibleDuration;
  }

  return [
    { label: 'SQL',          value: sql,              color: COLOR_SQL },
    { label: 'ActiveRecord', value: ar,               color: COLOR_ACTIVE_RECORD },
    { label: 'Other',        value: (c - (ar + sql)), color: COLOR_OTHER }
  ];
}

const MAX_SQL_STATEMENTS = 5;
const bySql = (events=[]) => {
  if (events.length === 0) return [];

  const items = [];
  const sqlToEvent = new Map();

  for (let i = 0; i < events.length; ++i) {
    const event = events[i];

    if (event.event.type === TYPE_SQL) {
      const { visibleDuration:value, event: { sql:label, sqlHash } } = event;

      if (sqlToEvent.has(label)) {
        sqlToEvent.get(label).value += value;
      }
      else {
        const item = { label, value, sqlHash, color: event.event.color };
        items.push(item);
        sqlToEvent.set(label, item);
      }
    }
  };

  const sortedItems = items.sort(compareValue);
  return (
    sortedItems.length <= MAX_SQL_STATEMENTS
      ? sortedItems
      : sortedItems.slice(0, MAX_SQL_STATEMENTS).concat({
          color: COLOR_OTHER,
          label: 'Other',
          value: sumValue(sortedItems.slice(MAX_SQL_STATEMENTS))
        })
  );
}

export default function SummaryTab({ visibleEvents, onHoverSql }) {
  return (
    <div className='SummaryTab flex flex--row'>
      <Breakdown items={visibleEvents} reducer={byType} unit='ms'/>
      <Breakdown
        items={visibleEvents}
        reducer={bySql}
        unit='ms'
        onHover={agg => onHoverSql(agg && agg.sqlHash)}
      />
    </div>
  );
}
