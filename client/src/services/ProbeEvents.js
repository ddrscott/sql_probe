import MOCK_EVENTS from './MOCK_ProbeEvents';

import colorWheelHue from '../utils/colorWheelHue';
import stringHash from '../utils/stringHash';

export const TYPE_ACTIVE_RECORD = 'instantiation.active_record';
export const TYPE_SQL = 'sql.active_record';
export const TYPE_CONTROLLER = 'rails.controller';
export const TYPE_OTHER = 'other';

export const COLOR_ACTIVE_RECORD = '#E8E8E8';
export const COLOR_SQL = '#36A2EB';
export const COLOR_CONTROLLER = '#FF6384';
export const COLOR_OTHER = '#E8E8E8';

let events = [];
const listeners = new Set();

function EventMeta(index, hash) {
  this.count = 0;
  this.index = index;
  this.hash = hash;
}

const NON_SQL_META = new EventMeta(0, 0);

// TODO: Check w/@ddrscott that we can reasses the event set and event data
// sent from the backend.
//    1. EventSet: Add `id`, `type`, time`, `end` attributes to match Events
//       - This might suggest that we don't care about EventSets... and
//         everything is an Event...
//    2. I suspect there alot of attributes we don't use...
function mungeEvent({ caller, duration, name, sql, time, type }, id, meta){
  return {
    caller,
    color: (
      type === TYPE_ACTIVE_RECORD
        ? COLOR_ACTIVE_RECORD
        : colorWheelHue(meta.index)
    ),
    count: meta.count,
    duration,
    durationCeil: Math.ceil(duration),
    id,
    isCached: name === 'CACHE',
    name,
    sql,
    sqlHash: meta.hash,
    time: Date.parse(time),
    type
  }
};

const mungeEventSet = ({ duration, events, start_time, params: { controller, action } }) => {
  let index = 0;
  const sqlToMeta = new Map([[undefined, NON_SQL_META]]);
  events
    .filter(e => e.type === TYPE_SQL)
    .forEach(({ sql }) => {
      let meta = sqlToMeta.get(sql);
      if (meta === undefined){
        meta = new EventMeta(index++, stringHash(sql));
        sqlToMeta.set(sql, meta);
      }
      meta.count++;
    });

  return {
    duration,
    durationCeil: Math.ceil(duration),
    events: events.map((event, i) => mungeEvent(event, i, sqlToMeta.get(event.sql))),
    id: start_time,
    name: `${controller}#${action}`,
    time: start_time * 1000,
    type: TYPE_CONTROLLER
  }
};

const addEvent = eventSet => {
  events = events.concat(mungeEventSet(eventSet));
  for(let l of listeners) {
    l(events);
  }
}

setTimeout(() => MOCK_EVENTS.forEach(addEvent));
// new WebSocket(`ws://${window.location.host}/sql_probe/live/feed`)
//   .onmessage = ({ data }) => {
//     if (data.charCodeAt(0) === 123 /* { */) {
//       addEvent(JSON.parse(data));
//     }
//   };

export default {
  events,
  on: l => listeners.add(l),
  off: l => listeners.delete(l)
}

