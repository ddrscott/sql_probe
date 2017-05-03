import React from 'react';
import {
  COLOR_ACTIVE_RECORD, COLOR_SQL, COLOR_OTHER,
  TYPE_ACTIVE_RECORD, TYPE_SQL, TYPE_CONTROLLER
} from '../../services/ProbeEvents';
import colorWheelHue from '../../utils/colorWheelHue';
import Breakdown from './Breakdown';

const round = num => ((num * 100) | 0) / 100;

const sumTime = events =>
  round(
    events.reduce((total, { duration }) =>
      total + duration, 0
    )
  );

const compareValue = ({ value: a }, { value: b }) => b - a;

const byType = (events=[]) => {
  if (events.length === 0) return [];

  const ar = sumTime(events.filter(e => e.type === TYPE_ACTIVE_RECORD));
  const sql = sumTime(events.filter(e => e.type === TYPE_SQL));
  const other = sumTime(events.filter(e => e.type === TYPE_CONTROLLER)) - (ar + sql);

  return [
    { label: 'ActiveRecord', value: ar,    color: COLOR_ACTIVE_RECORD },
    { label: 'SQL',          value: sql,   color: COLOR_SQL },
    { label: 'Other',        value: other, color: COLOR_OTHER },
  ].sort(compareValue);
}

const bySql = (events=[]) => {
  const sqlToEvent = new Map();
  events.forEach(({ duration, name, type }) => {
    if (type === TYPE_SQL) {
      sqlToEvent.set(name, duration + (sqlToEvent.get(name) || 0));
    }
  });

  return [...sqlToEvent.entries()]
    .map(([label, duration]) => ({ label, value: round(duration) }))
    .sort(compareValue)
    .map((item, i) => ({ ...item, color: `hsl(${colorWheelHue(i)}, 60%, 60%)` }));
}

export default ({ visibleEvents }) => (
  <div className='flex flex-grow flex--row'>
    <Breakdown items={visibleEvents} reducer={byType} unit='ms' />
    <Breakdown items={visibleEvents} reducer={bySql}  unit='ms' />
  </div>
);
