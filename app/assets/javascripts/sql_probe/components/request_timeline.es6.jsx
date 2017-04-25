class RequestTimeline extends React.Component {
  constructor(props) {
    super(props);
    LiveFeed.onMessage(json => {
      if (this.state.dataTable) {
        this.state.dataTable.addRow([
          json.name,
          json.start_time * 1000,
          Date.parse(json.events[json.events.length - 1].time)
        ]);
        this.setState(prevState => ({
          dataTable: this.state.dataTable,
          rows: this.state.rows.concat([json])
        }));
      }
    })
    this.state = {
      rows: []
    };
  }

  componentDidMount() {
    this.initChart();

    // resize chart as needed
    window.addEventListener("resize", () => this.drawChart());
    document.addEventListener('split.resize', () => this.drawChart());
  }

  initChart() {
    if (typeof google == 'undefined') {
      console.error('Could not load `google`. Make sure you are online.')
      return;
    }
    google.charts.load('current', {'packages':['timeline']});
    google.charts.setOnLoadCallback(() => {
      var container = this.timelineElm;
      var timeline = new google.visualization.Timeline(container);
      var dataTable = new google.visualization.DataTable();

      dataTable.addColumn({ type: 'string', id: 'Title' });
      dataTable.addColumn({ type: 'number', id: 'Start' });
      dataTable.addColumn({ type: 'number', id: 'End' });
      dataTable.addRow(['Started', Date.now() - 1000, Date.now()]);

      var options = {
        height: $(container).parent().height(), 
        width: $(container).parent().width(), 
        fontSize: 9,
        padding: 0,
        // timeline: {
        //   rowLabelStyle: { fontSize: 9, padding: 0}
        // }
      };
      google.visualization.events.addListener(timeline, 'select', () => {
        var row = timeline.getSelection()[0].row;
        if (row > 0) {
          var event = new CustomEvent('sql_probe.load.sql.timeline', {detail: this.state.rows[row - 1]});
          document.dispatchEvent(event);
        }
      });
      this.setState({
        timeline: timeline,
        dataTable: dataTable,
        options: options
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    this.drawChart();
  }

  drawChart() {
    var {timeline, dataTable, options} = this.state;
    if (dataTable.getNumberOfRows() > 0) {
      options.height = $(this.timelineElm).parent().height();
      options.width = $(this.timelineElm).parent().width();
      // js will bomb if there's no rows
      timeline.draw(dataTable, options);
    }
  }

  render() {
    return (
      <div ref={(elm) => { this.timelineElm = elm }} />
    )
  }
}
