class RequestPanel extends React.Component {

  constructor(props) {
    super(props);
    this.TABS = ['Both', 'Table Only', 'Timeline Only']
    this.state = {
      selectedTab: 0
    }
  }

  componentDidMount() {
    this.split();
  }

  componentDidUpdate() {
    this.split();
  }

  split() {
    if ($('.split-aa').length > 0) {
      Split(['.split-aa', '.split-ab'], {
        sizes: [50,50],
        direction: 'vertical',
        gutterSize: 3,
        cursor: 'row-resize',
        onDrag: function() {
          document.dispatchEvent(new Event('split.resize'));
        }
      })
    }
  }

  render() {
    const Tab = (props) => (
      <button
        type="button" 
        key={props.index} 
        onClick={() => this.setState({ selectedTab: props.index}) } 
        className={"btn btn-default " + (this.state.selectedTab == props.index ? 'active' : '')} >
        {this.TABS[props.index]}
      </button>
    )

    return (
      <div className="full-size split-panel">
        <div className='split-head'>
          <div className='split-head-buttons pull-right'>
            <div className="btn-group btn-group-xs" role="group" aria-label="...">
              <Tab index={0} />
              <Tab index={1} />
              <Tab index={2} />
            </div>
          </div>
          <h3>Event Groups</h3>
        </div>
        {
          this.state.selectedTab === 0 &&
            <div className='split-body' style={{overflow: 'hidden'}}>
              <div className='split split-vertical split-aa'>
                <RequestTimeline className='full-size' ref={(elm) => this.refTimeline = elm} />
              </div>
              <div className='split split-vertical split-ab table-responsive'>
                <RequestTable className='full-size' ref={(elm) => this.refTable = elm}/>
              </div>
            </div>
        }
        {
          this.state.selectedTab === 1 &&
            <div className='split-body'>
              <RequestTable className='full-size' ref={(elm) => this.refTable = elm}/>
            </div>
        }
        {
          this.state.selectedTab === 2 &&
            <div className='split-body'>
              <RequestTimeline className='split-body full-size' ref={(elm) => this.refTimeline = elm} />
            </div>
        }
      </div>
    )
  }
}
