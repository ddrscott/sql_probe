class RequestTable extends React.Component {
  constructor(props) {
    super(props);
    LiveFeed.onMessage(json => {
      this.setState(prevState => ({
        rows: this.state.rows.concat([json])
      }));
    })
    this.state = {
      rows: []
    };
  }

  renderRows() {
    return this.state.rows.map((row) =>
      <tr>
        <td>{ row.name }</td>
        <td>{ row.start_time }</td>
        <td>{ row.duration }</td>
        <td>{ row.events.length }</td>
      </tr>
    );
  }

  render() {
    return (
      <table className="table table-compressed">
        <tr>
          <th>Name</th>
          <th>Start</th>
          <th>Duration</th>
          <th>Queries</th>
        </tr>
        { this.renderRows() }
      </table>
    )
  }
}
