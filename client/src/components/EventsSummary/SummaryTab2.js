import './SummaryTab2.css';
import '../../css/flex.css';
import '../../css/text.css';
import React from 'react';
import {
  COLOR_ACTIVE_RECORD, COLOR_SQL, COLOR_OTHER,
  TYPE_ACTIVE_RECORD, TYPE_SQL, TYPE_CONTROLLER
} from '../../services/ProbeEvents';

const sumValue = items => items.reduce((sum, { value }) => sum + value, 0.0);
const compareVisibleDuration = (a, b) => b.visibleDuration - a.visibleDuration;
const round = num => ((num * 100.0) | 0) / 100.0;
const pct = (part, total) => 100.0 * part / total;

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

function Aggregate(label) {
  this.label = label;
  this.visibleDuration = 0;
  this.items = [ ];
}

Aggregate.prototype.addItem = function(item) {
  this.items.push(item);
  this.visibleDuration += item.visibleDuration;
  return this;
}

const MAX_SQL_STATEMENTS = 5;
const EMPTY = { totalDuration: 0.0, sortedItems: [] };
const bySql = (visibleItems=[]) => {
  if (visibleItems.length === 0) return EMPTY;

  let totalDuration = 0.0;
  const items = [];
  const sqlToEvent = new Map();

  for (let i = 0; i < visibleItems.length; ++i) {
    const item = visibleItems[i];

    if (item.event.type === TYPE_SQL) {
      totalDuration += item.visibleDuration;
      const { event: { sql, sqlHash } } = item;

      if (sqlToEvent.has(sqlHash)) {
        sqlToEvent.get(sqlHash).addItem(item);
      }
      else {
        const agg = new Aggregate(sql).addItem(item);
        items.push(agg);
        sqlToEvent.set(sqlHash, agg);
      }
    }
  };

  const sortedItems = items.sort(compareVisibleDuration);
  if (sortedItems.length <= MAX_SQL_STATEMENTS) return { totalDuration, sortedItems };

  const otherAggs = sortedItems.slice(MAX_SQL_STATEMENTS);
  const otherAgg = new Aggregate('Other');
  for (let i = 0; i < otherAggs.length; ++i) {
    otherAgg.addItem(otherAggs[i]);
  }

  return { totalDuration, sortedItems: sortedItems.slice(0, MAX_SQL_STATEMENTS).concat(otherAgg) };
}

export default function SummaryTab2({ visibleEvents, onHoverSql }) {
  const { totalDuration, sortedItems } = bySql(visibleEvents);
  return (
    <div className='SummaryTab2'>
      <div className='SummaryTab2-row SummaryTab2-row--header'>
        <div className='SummaryTab2-cell SummaryTab2-cell--count'>
          Count
        </div>
        <div className='SummaryTab2-cell SummaryTab2-cell--duration'>
          Time
        </div>
        <div className='SummaryTab2-cell SummaryTab2-cell--label'>
          SQL
        </div>
      </div>
      {sortedItems.map((agg, i) => {
        const ratio = agg.visibleDuration / totalDuration;
        return (
          <div className='SummaryTab2-row text-align-right' key={i}>
            <div className='SummaryTab2-cell SummaryTab2-cell--count'>
              {agg.items.length}
            </div>
            <div className='SummaryTab2-cell SummaryTab2-cell--duration flex flex--row'>
              <div
                className='SummaryTab2-cellPct'
                style={{ transform: `scaleX(${ratio})` }}
              />
              <div className='flex-grow'>
                {round(agg.visibleDuration)} ms
              </div>
              <div className='SummaryTab2-cell--durationPct'>
                {round(ratio * 100.0)} %
              </div>
            </div>
            <div className={`SummaryTab2-cell SummaryTab2-cell--label ${ agg.label !== 'Other' ? 'SummaryTab2-cell--labelSql' : '' } text-align-left`}>
              {agg.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
