// import MOCK_EVENTS from './MOCK_ProbeEvents';

import KeyIndex from '../utils/KeyIndex';
import color from '../utils/colorWheelHue';
import stringHash from '../utils/stringHash';

export const TYPE_ACTIVE_RECORD = 'instantiation.active_record';
export const TYPE_SQL = 'sql.active_record';
export const TYPE_CONTROLLER = 'rails.controller';
export const TYPE_OTHER = 'other';

export const COLOR_ACTIVE_RECORD = '#E8E8E8';
export const COLOR_SQL = '#36A2EB';
export const COLOR_CONTROLLER = '#FF6384';
export const COLOR_OTHER = '#E8E8E8';

const events = window.EVENTS = [];
let listeners = [];

// TODO: Check w/@ddrscott that we can reasses the event set and event data
// sent from the backend.
//    1. EventSet: Add `id`, `type`, time`, `end` attributes to match Events
//       - This might suggest that we don't care about EventSets... and
//         everything is an Event...
//    2. I suspect there alot of attributes we don't use...
function mungeEvent({ caller, duration, name, sql, time, type }, id){
  return {id,
  type,
  sql,
  sqlHash: sql ? stringHash(sql) : 0,
  name,
  isCached: name === 'CACHE',
  time: Date.parse(time),
  duration,
  caller,
  color: (
    type === TYPE_ACTIVE_RECORD
      ? COLOR_ACTIVE_RECORD
      : color(this.getIndex(sql))
  )}
};

const mungeEventSet = ({ duration, events, start_time, params: { controller, action } }) => ({
  id: start_time,
  type: TYPE_CONTROLLER,
  name: `${controller}#${action}`,
  time: (start_time * 1000),
  duration,
  events: events.map(mungeEvent, new KeyIndex())
});

const addEvent = eventSet => {
  events.push(mungeEventSet(eventSet));
  listeners.forEach(l => l(events));
}

// setTimeout(() => {
//   MOCK_EVENTS.forEach(addEvent);
// });
new WebSocket(`ws://${window.location.host}/sql_probe/live/feed`)
  .onmessage = ({ data }) => {
    if (data.charCodeAt(0) === 123 /* { */) {
      addEvent(JSON.parse(data));
    }
  };

export default {
  events,

  on(l) {
    if (listeners.indexOf(l) === -1) {
      listeners.push(l);
    }
  },

  off(l) { listeners = listeners.filter(lb => lb !== l); }
}

