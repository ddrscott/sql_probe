export const TYPE_ACTIVE_RECORD = 'instantiation.active_record';
export const TYPE_SQL = 'sql.active_record';
export const TYPE_CONTROLLER = 'rails.controller';
export const TYPE_OTHER = 'other';

export const COLOR_ACTIVE_RECORD = '#FFCE56';
export const COLOR_SQL = '#36A2EB';
export const COLOR_CONTROLLER = '#FF6384';
export const COLOR_OTHER = '#DDD';

let events = [];
let listeners = [];

// TODO: Check w/@ddrscott that we can reasses the event set and event data
// sent from the backend.
//    1. EventSet: Add `id`, `type`, time`, `end` attributes to match Events
//       - This might suggest that we don't care about EventSets... and
//         everything is an Event...
//    2. I suspect there alot of attributes we don't use...
const mungeData = probeEvent => {
  const { duration, events, start_time, params: { controller, action } } = probeEvent;
  return {
    ...probeEvent,
    id: start_time,
    name: `${controller}#${action}`,
    type: TYPE_CONTROLLER,
    time: Math.round(start_time*1000),
    end: Math.round(start_time*1000 + duration),
    color: COLOR_OTHER,
    events: events.map((e, i) => {
      const time = Date.parse(e.time);
      return {
        ...e,
        id: `${start_time}-${i}`,
        name: e.sql || e.name,
        time,
        end: (time + e.duration),
        color: (
            e.type === TYPE_ACTIVE_RECORD ? COLOR_ACTIVE_RECORD
          : e.type === TYPE_SQL ? COLOR_SQL
          : ''
        )
      };
    })
  };
}

const addEvent = event => {
  events = events.concat(mungeData(event));
  listeners.forEach(l => l(events));
}

export default {
  get events() { return events; },

  on(listener) {
    if (listeners.indexOf(listener) === -1)
      listeners.push(listener);
  },

  off(listener) {
    listeners = listeners.filter(l => l !== listener);
  }
}

const ws = new WebSocket(`ws://${location.host}/sql_probe/live/feed`);
ws.onmessage = ({ data }) => {
  if (data.charCodeAt(0) === 123 /* { */) {
    addEvent(JSON.parse(data));
  }
};
