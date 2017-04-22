class RequestTable extends React.Component {
  constructor(props) {
    super(props);
    LiveFeed.onMessage(json => {
      this.setState(prevState => ({
        rows: [json].concat(this.state.rows)
      }));
    })
    this.state = {
      rows: []
    };
  }

  renderDate(number) {
    return new Date(number).toString().split(" ")[4]
  }

  renderRows() {
    return this.state.rows.map((row) =>
      <tr key={row.start_time}>
        <td>{ row.name }</td>
        <td>{ this.renderDate(row.start_time * 1000) }</td>
        <td>{ Math.round(row.duration) }</td>
        <td>{ row.events.length }</td>
      </tr>
    );
  }

  totalQueries() {
    return this.state.rows.reduce((acc, r) => (acc + r.events.length), 0)
  }

  totalDuration() {
    return Math.round(
      this.state.rows.reduce((acc, r) => (acc + r.duration), 0)
    )
  }

  render() {
    return (
      <table className="table request-table table-condensed table-hover">
        <thead>
          <tr>
            <th>Event ({ this.state.rows.length })</th>
            <th>Start</th>
            <th>Millis ({ this.totalDuration() })</th>
            <th>Queries ({ this.totalQueries() })</th>
          </tr>
        </thead>
        <tbody>
          { this.renderRows() }
        </tbody>
      </table>
    )
  }
}
