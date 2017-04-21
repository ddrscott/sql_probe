class Splits extends React.Component {

  componentDidMount() {
    Split(['.split-first', '.split-last'], {
      sizes: [75, 25],
      gutterSize: 2,
      cursor: 'col-resize'
    })
  }

  render() {
    return <div className="splits">
        <div className='split split-first'>
        </div>
        <div className='split split-last'>
        </div>
      </div>;
  }
}
