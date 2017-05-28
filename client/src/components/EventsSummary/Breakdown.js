import '../../css/flex.css';
import './Breakdown.css';
import React, { Component } from 'react';
import Chart from 'chart.js';

export default class extends Component {
  constructor() {
    super();
    this.mountCanvas = this.mountCanvas.bind(this);
    this.state = { data: [] };
  }

  updateData({ items, reducer }) {
    const { chart } = this;
    const data = reducer(items);
    this.setState({ data });

    if (chart) {
      const colors = data.map(d => d.color);
      chart.data.labels = data.map(d => d.label);
      chart.data.datasets[0].data = data.map(d => d.value);

      Object.assign(chart.data.datasets[0], {
        data: data.map(d => d.value),
        backgroundColor: colors,
        hoverBackgroundColor: colors
      });
      chart.update();
    }
  }

  componentWillReceiveProps(props) {
    const { items, reducer } = this.props;
    if(
      props.items && props.reducer
        && (items !== props.items || reducer !== props.reducer)
    ) {
      this.updateData(props);
    }
  }

  mountCanvas(canvas) {
    this.canvas = canvas;
    if (canvas) {
      this.chart = new Chart(canvas, {
        type: 'pie',
        options: {
          legend: { display: false }
        },
        data: {
          labels: [],
          datasets: [ { data: [] } ]
        }
      });
      this.updateData(this.props);
    }
  }

  render() {
    const {
      state: { data },
      props: { unit }
    } = this;
    return (
      <div className='Breakdown'>
        <div className='flex flex--row'>
          <div className='Breakdown-graphContainer'>
            <canvas ref={this.mountCanvas}/>
          </div>
          <div className='flex-grow flex-self-center'>
            <table>
              <tbody>
                {data.map(({ label, color, value }) =>
                  <tr className='Breakdown-item' key={label}>
                    <td className='Breakdown-value'>
                      {`${value.toFixed(2)} ${unit}`}
                    </td>
                    <td>
                      <div className='Breakdown-box' style={{color}} />
                    </td>
                    <td className='Breakdown-label'>
                      {label}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
