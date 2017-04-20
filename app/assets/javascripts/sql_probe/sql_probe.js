SqlProbe = {
  initLive: function(output, event_path) {
    var self = this;
    var ws = new WebSocket("ws://" + window.location.host + location.pathname + "/feed");
    ws.onmessage = function(event) {
      if (event.data.length) {
        try {
          var json = JSON.parse(event.data);
          self.liveData.push(json);
          console.log(json);
          var a = $('<a/>')
            .attr('href', event_path.replace('PATH', encodeURIComponent(json.path)))
            .attr('target', 'sql_probe_details')
            .text(json.name);
          output.prepend("<br/>").prepend(a);
        } catch(err) {
          output.prepend(event.data);
        }
      }
    }
  },
  liveData: []
};
