class RequestPanel extends React.Component {

  componentDidMount() {
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
  
  render() {
    return (
      <div className="full-size">
        <div className='split split-vertical split-aa split-panel'>
          <div className='split-head'>
            <div className='split-head-buttons pull-right'>
            </div>
            <h3>Request Timeline <small>(select timeline block or row to load right split)</small></h3>
          </div>
          <div className='split-body' style={{overflow: 'hidden'}}>
            <RequestTimeline className='full-size' />
          </div>
        </div>
        <div className='split split-vertical split-ab table-responsive'>
          <RequestTable className='full-size' />
        </div>
      </div>
    )
  }
}
