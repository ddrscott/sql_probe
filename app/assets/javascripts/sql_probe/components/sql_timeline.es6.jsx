class SqlTimeline extends React.Component {
  constructor(props) {
    super(props);

    document.addEventListener('sql_probe.load.sql.timeline', (event) => {
      this.setState(prevState => ({
        events: event.detail.events
      }));
    }, false);

    this.state = {
      events: [],
      selectedTab: 'sql'
    };
  }

  tabs() {
    return {
      sql: (<StatementTab />),
      explain: 'explain coming soon',
      backtrace: 'backtrace comming soon'
    };
  }

  componentDidMount() {
    this.initChart();
    // resize chart as needed
    window.addEventListener("resize", () => this.drawChart());
    document.addEventListener('split.resize', () => this.drawChart());

    Split(['.split-e', '.split-f'], {
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

  handleTabSelection(tab) {
    this.setState({
      selectedTab: tab
    })
  }

  renderTab() {
    const tab = this.state.selectedTab;
    return this.tabs()[tab]
  }

  renderTabButtons(){
    return Object.keys(this.tabs()).map( tab => {
      return (
        <button
          type="button"
          key={tab}
          onClick={() => {this.handleTabSelection(tab)}}
          className={"btn btn-default " + (this.state.selectedTab == tab ? 'active' : '')}
        >
          {tab}
        </button>
      )
    });
  }

  render() {
    return (
      <div className='split-with-heading'>
        <div className='split-head'>
          <div className='split-head-buttons pull-left'>
            (buttons)
          </div>
          <h3 className='text-right'>SQL Timeline</h3>
        </div>
        <div className='split-body'>
          <div className='split split-vertical split-e'>
            <div ref={(elm) => { this.timelineElm = elm }} />
          </div>
          <div className='split split-vertical split-f'>
            <div className='split-with-heading'>
              <div className='split-head'>
                <div className="btn-group btn-group-xs" role="group" aria-label="...">
                  {this.renderTabButtons()}
                </div>
              </div>
              <div className='split-body'>
                {this.renderTab()}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
