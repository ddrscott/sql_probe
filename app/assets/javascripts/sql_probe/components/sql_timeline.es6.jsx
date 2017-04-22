class SqlTimeline extends React.Component {
  constructor(props) {
    super(props);

    document.addEventListener('sql_probe.load.sql.timeline', (event) => {
      this.setState(prevState => ({
        events: event.detail.events
      }));
    }, false);

    this.state = {
      events: []
    };
  }

  componentDidMount() {
    this.initChart();
    // resize chart as needed
    window.addEventListener("resize", () => this.drawChart());
    document.addEventListener('split.resize', () => this.drawChart());
  }

  initChart() {
    google.charts.load('current', {'packages':['timeline']});
    google.charts.setOnLoadCallback(() => {
      var container = this.timelineElm; //document.getElementById('live-timeline');
      var timeline = new google.visualization.Timeline(container);
      var dataTable = new google.visualization.DataTable();

      dataTable.addColumn({ type: 'string', id: 'Title' });
      dataTable.addColumn({ type: 'number', id: 'Start' });
      dataTable.addColumn({ type: 'number', id: 'End' });

      var options = {
        height: $(container).parent().height(), 
        width: $(container).parent().width(), 
        // backgroundColor: 'transparent',
        timeline: {
          rowLabelStyle: { fontSize: 12, padding: 0 }
        }
      };
      google.visualization.events.addListener(timeline, 'select', function() {
        var row = timeline.getSelection()[0].row;
        console.log('selected: ', row);
        // EventDetailDialog.show(sqlEventData[row]);
      });
      this.setState({
        timeline:  timeline,
        dataTable: dataTable,
        options:   options
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    this.drawChart();
  }

  eventsToDataRow(events) {
    var base = 0;
    return events.map((event) => [event.sql, base, (base += event.elapsed) ]);
  }

  drawChart() {
    const {timeline, dataTable, options, events} = this.state;
    if (events.length > 0) {
      if (dataTable.getNumberOfRows() > 0) {
        dataTable.removeRows(0, dataTable.getNumberOfRows());
      }
      dataTable.addRows(this.eventsToDataRow(events));
      options.height = $(this.timelineElm).parent().height();
      options.width = $(this.timelineElm).parent().width();
      // js will bomb if there's no rows
      timeline.draw(dataTable, options);
    }
  }

  render() {
    return (
      <div ref={(elm) => { this.timelineElm = elm }} >
      </div>
    )
  }
}
