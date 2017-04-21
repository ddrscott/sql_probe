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
          dataTable: this.state.dataTable
        }));
      }
    })
    this.state = {
      liveData: []
    };
  }

  componentDidMount() {
    this.initChart();
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
      dataTable.addRow(['Started', Date.now() - 1000, Date.now()]);

      var options = {
        // @see http://stackoverflow.com/a/18643370/613772
        // 42 is the magic number to get all the rows to display
        // without overflow.
        height: $(container).parent().height(), 
        width: $(container).parent().width(), 
        // avoidOverlappingGridLines: false,
        backgroundColor: 'transparent',
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
    console.log('called drawChart');
    var {timeline, dataTable, options} = this.state;
    if (dataTable.getNumberOfRows() > 0) {
      options.height = $(this.timelineElm).parent().height();
      options.width = $(this.timelineElm).parent().width();
      // js will bomb if there's no rows
      timeline.draw(dataTable, options);
    }
  }

  renderRows() {
    return this.state.liveData.map((row) =>
      <li>{row.name}</li>
    );
  }

  render() {
    return (
      <div
        ref={(elm) => { this.timelineElm = elm }} >
      </div>
    )
  }
}
