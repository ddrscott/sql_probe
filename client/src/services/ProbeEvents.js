export const TYPE_ACTIVE_RECORD = 'instantiation.active_record';
export const TYPE_SQL = 'sql.active_record';
export const TYPE_CONTROLLER = 'rails.controller';
export const TYPE_OTHER = 'other';

export const COLOR_ACTIVE_RECORD = '#FFCE56';
export const COLOR_SQL = '#36A2EB';
export const COLOR_CONTROLLER = '#FF6384';
export const COLOR_OTHER = '#DDD';

const events = [];
let listeners = [];

// TODO: Check w/@ddrscott that we can reasses the event set and event data
// sent from the backend.
//    1. EventSet: Add `id`, `type`, time`, `end` attributes to match Events
//       - This might suggest that we don't care about EventSets... and
//         everything is an Event...
//    2. I suspect there alot of attributes we don't use...
const mungeEvent = ({ time, type, sql, name, duration }, id) => ({
  id,
  type,
  name: sql || name,
  time: Date.parse(time),
  duration
});

const mungeEventSet = ({ duration, events, start_time, params: { controller, action } }) => ({
  id: start_time,
  type: TYPE_CONTROLLER,
  name: `${controller}#${action}`,
  time: (start_time * 1000),
  duration,
  events: events.map(mungeEvent)
});

const addEvent = eventSet => {
  events.push(mungeEventSet(eventSet));
  listeners.forEach(l => l(events));
}

new WebSocket(`ws://${location.host}/sql_probe/live/feed`)
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

  off(l) { listeners = listeners.filter(l => l !== l); }
}

