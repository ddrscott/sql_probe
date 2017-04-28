import React, { Component } from 'react';
import CodeMirror from 'react-codemirror';
import Code from './Code';
import './EventDetails.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/sql/sql';
import PanelSplit from './PanelSplit';

const SQL_CODE_MIRROR_OPTIONS = {
  lineNumbers: true,
  lineWrapping: true,
  readOnly: true,
  mode: 'text/x-pgsql'
}

// TODO: Extract to it's own file
const StackTrace = ({ callStack, selected, onSelect }) => (
  <form className='StackTrace'>
    <fieldset>
      {callStack.map((call, i) => (
        <div className='StackTrace-call' key={i}>
          <input
            type="radio"
            id={`radio-${i}`}
            name='call-stack'
            checked={selected === i}
            onChange={() => onSelect(i)}
          />
          <label htmlFor={`radio-${i}`}>
            {call}
          </label>
        </div>
      ))}
    </fieldset>
  </form>
);

const getFilename = locator => locator.split(/:\d+:in /)[0];

const EventDetails = ({ event: { caller, sql }, selectedCall, onSelectCall }) => {
  const locator = caller[selectedCall];
  return (
    <PanelSplit
      initialSize={40}
      a={<CodeMirror className='EventDetails-sql' value={sql} options={SQL_CODE_MIRROR_OPTIONS} />}
      b={
        <PanelSplit
          orientation='horizontal'
          a={
            <div className='EventDetails-stack'>
              <div className='EventDetails-panelHeader'>Stack</div>
              <StackTrace
                callStack={caller}
                selected={selectedCall}
                onSelect={onSelectCall}
              />
            </div>
          }
          b={
            <div className='EventDetails-code'>
              <div className='EventDetails-panelHeader'>{getFilename(locator)}</div>
              <Code className='EventDetails-ruby' path={locator}/>
            </div>
          }
        />
      }
    />
  );
};

export default class extends Component {
  constructor() {
    super();
    this.state = { selectedCall: 0 };
  }

  componentWillReceiveProps({ event }) {
    if (event !== this.props.event)
      this.setState({ selectedCall: 0 });
  }

  render() {
    const { props: { event }, state: { selectedCall } } = this;
    return (
      <div className='EventDetails'>
        {event &&
          <EventDetails
            event={event}
            selectedCall={selectedCall}
            onSelectCall={selectedCall => this.setState({ selectedCall })}
          />
        }
      </div>
    );
  }
}
