class BacktracePanel extends React.Component {
  constructor(props) {
    super(props);
  }

  parseLocator(caller) {
    // sample: ./app/views/appointments/_calendar.erb:10:in `_app_views_appointments__calendar_erb'
    const stripped = caller.replace(SqlProbe.railsRoot, '.');
    const match = /(.+)\/([^\/]+):(\d+):in `(.+)'/.exec(stripped);
    if (match) {
      return {
        file_dir:  match[1],
        file_base: match[2],
        full_path: match[1] + match[2],
        line:      match[3],
        method:    match[4]
      }
    }
    return {};
  }

  renderRow(caller, i) {
    const locator = this.parseLocator(caller);
    return (
      <tr key={i}>
        <td>{i}</td>
        <td>{locator.file_base || caller}</td>
        <td>{locator.line}</td>
        <td>{locator.file_dir}</td>
        <td>{locator.method}</td>
      </tr>
    )
  }

  renderRows(callers) {
    return (
      <table className="table table-condensed table-bordered table-hover backtrace-table">
        <thead>
          <tr>
            <th>#</th>
            <th>File</th>
            <th>Line</th>
            <th>Dir</th>
            <th>Method</th>
          </tr>
        </thead>
        <tbody>
          {callers.map((caller, i) => this.renderRow(caller, callers.length-i))}
        </tbody>
      </table>
    )
  }

  render() {
    return <div className={this.props.className + ' table-responsive'} >{this.renderRows(this.props.caller)}</div>
  }
}
