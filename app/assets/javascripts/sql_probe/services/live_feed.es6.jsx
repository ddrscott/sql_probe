const LiveFeed = {
  onMessage(receiver) {

    const ws = new WebSocket("ws://" + window.location.host + window.SQL_PROBE_CONFIG.live_feed_path);
    ws.onmessage = (event) => {
      if (event.data.length && event.data.startsWith('{')) {
        try {
          var json = JSON.parse(event.data);
          receiver(json);
        } catch(err) {
          console.error(err);
          console.error('ignoring message: ', event.data);
        }
      }
    }
  }
}
