import fetch from 'unfetch'
import React, { Component } from 'react';

export default class extends Component {
  constructor() {
    super();
    this.fetchData();
    this.state = { data: [] };
  }

  async fetchData() {
    const response = await fetch('/sql_probe/pivot.json');
    const data = await response.json();
    this.setState({ data: data });
  }

  renderRow(event) {
    return <tr>
        <td>
          {event.name}
        </td>
        <td>{ event.mtime }</td>
        <th>{ event.queries }</th>
        <td>{ event.duration }</td>
        { Object.entries(event.values).map((value) => <td>{ value[1] > 0 && value[1] }</td>) }
      </tr>
  }

  render() {
    // console.log("state => ", this.state);
    const first = this.state.data ? this.state.data[0] : false;
    return <div style={{ padding: 24 }}>
      <table>
        <tr>
          <th>Name</th>
          <th>Time</th>
          <th>Total Queries</th>
          <th>Duration ms</th>
          { first && Object.entries(first.values).map((value) => <th>{ value[0] }</th>) }
        </tr>
        <tbody>
          { first && this.state.data.map((row) => this.renderRow(row)) }
        </tbody>
      </table>
    </div>
  };
}
