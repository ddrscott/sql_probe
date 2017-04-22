/**
 * Publishes the following custom event to `document`:
 * 'sql_probe.data': { name, start_time, duration, events, params }
 */
const LiveFeed = {
  start(webSocketUrl) {
    const ws = new WebSocket(webSocketUrl);
    ws.onmessage = (event) => {
      if (event.data.length && event.data.startsWith('{')) {
        try {
          var json = JSON.parse(event.data),
              event = new CustomEvent('sql_probe.data', {detail: json});
          document.dispatchEvent(event);
        } catch(err) {
          console.error(err);
          console.error('ignoring message: ', event.data);
        }
      }
    }
  },
  onMessage(receiver) {
    document.addEventListener('sql_probe.data', (event) => {
      receiver(event.detail);
    }, false);
  }
}
