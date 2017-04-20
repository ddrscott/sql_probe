// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require_tree .
//
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
