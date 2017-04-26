class SqlTimeline extends React.Component {
  constructor(props) {
    super(props);

    document.addEventListener('sql_probe.load.sql.timeline', (event) => {
      this.setState(prevState => ({
        events: event.detail.events
      }));
    }, false);

    const fakeEvent = {"name":null,
      "time":"2017-04-24T22:08:05.513-05:00",
      "transaction_id":"4cd72ad09a6b183223bd",
      "end":"2017-04-24T22:08:05.514-05:00",
      "children":[],
      "duration":0.633,
      "caller":["/Users/scott.pierce/code/hipaatitis/app/views/appointments/_calendar.erb:10:in `_app_views_appointments__calendar_erb__3395201065767941321_70313359100520'",
        "/Users/scott.pierce/code/hipaatitis/app/views/appointments/index.erb:1:in `_app_views_appointments_index_erb__3559067694734343123_70313406301500'",
        "/Users/scott.pierce/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'",
        "/Users/scott.pierce/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'"],
      "elapsed":5.713,
      "sql":"SELECT COUNT(*) FROM \"appointments\" WHERE (\"appointments\".\"when\" BETWEEN $1 AND $2)",
      "connection_id":70313336537100,
      "statement_name":null,
      "binds":[{"name":"when",
        "value_before_type_cast":"2017-04-01",
        "type":{"precision":null,
          "scale":null,
          "limit":null},
        "original_attribute":null,
        "value":"2017-04-01",
        "value_for_database":"2017-04-01"},
        {"name":"when",
          "value_before_type_cast":"2017-04-30",
          "type":{"precision":null,
            "scale":null,
            "limit":null},
          "original_attribute":null,
          "value":"2017-04-30",
          "value_for_database":"2017-04-30"}]};

    this.state = {
      events: [fakeEvent],
      selectedTab: 'sql',
      selectedEvent: fakeEvent
    };

    this.TABS = {
      sql: { },
      backtrace: { }
    }
  }

  componentDidMount() {
    this.initChart();
    // resize chart as needed
    window.addEventListener("resize", () => this.drawChart());
    document.addEventListener('split.resize', () => this.drawChart());

    Split(['.split-sql-timeline-a', '.split-sql-timeline-b'], {
      sizes: [50,50],
      direction: 'vertical',
      gutterSize: 3,
      cursor: 'row-resize',
      onDrag: function() {
        document.dispatchEvent(new Event('split.resize'));
      }
    })
  }

  initChart() {
    if (typeof google == 'undefined') {
      console.error('Could not load `google`. Make sure you have Internets.')
      return;
    }

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
        tooltip: {
          trigger: 'none'
        },
        timeline: {
          rowLabelStyle: { fontSize: 12, padding: 0 }
        }
      };
      google.visualization.events.addListener(timeline, 'select', () => {
        const row = timeline.getSelection()[0].row;
        const {events} = this.state;
        const event = events[row];
        document.dispatchEvent(new CustomEvent('sql_probe.selected.sql.event', {detail: event}));
        this.setState({selectedEvent: event});
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
    if (events.length > 0 && dataTable) {
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

  handleTabSelection(tab) {
    this.setState({ selectedTab: tab })
  }

  render() {
    const {selectedTab} = this.state;
    const button = tab => (
      <button 
        type="button" 
        key={tab} 
        onClick={() => this.setState({ selectedTab: tab }) } 
        className={"btn btn-default " + (this.state.selectedTab == tab ? 'active' : '')} >
        {tab}
      </button>
    );
    return (
      <div className={'full-size'} >
        <div className='split split-vertical split-sql-timeline-a split-panel'>
          <div className='split-head'>
            <div className='split-head-buttons pull-left'>
              (buttons)
            </div>
            <h3 className='text-right'>SQL Timeline</h3>
          </div>
          <div className='split-body'>
            <div ref={(elm) => { this.timelineElm = elm }}></div>
          </div>
        </div>

        <div className='split split-vertical split-sql-timeline-b split-panel'>
          <div className='split-head'>
            <div className="btn-group btn-group-xs" role="group" aria-label="...">
              { ['sql', 'backtrace'].map(button) }
            </div>
          </div>
          <div className='split-body'>
            { selectedTab == 'sql' ? <QueryPanel className='full-size' {...this.state.selectedEvent} /> : null }
            { selectedTab == 'backtrace' ? <BacktracePanel className='full-size' {...this.state.selectedEvent} /> : null }
          </div>
        </div>
      </div>
    )
  }
}
