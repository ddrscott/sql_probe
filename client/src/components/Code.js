import fetch from 'unfetch'
import React, { Component } from 'react';
import CodeMirror from 'react-codemirror';
import './Code.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/ruby/ruby';
import 'codemirror/mode/htmlembedded/htmlembedded';

const getLine = call => +call.split(':')[1];
const getMode = call => {
  const ext = /\.([^.]*)$/.exec(call.split(':')[0])[1];
  return ext === 'erb' ? 'application/x-erb' : 'ruby';
};

export default class extends Component {
  constructor({ path }) {
    super();
    this.fetchCode(path);
    this.state = { code: '' };
  }

  componentWillReceiveProps({ path }) {
    if (path !== this.props.path) {
      this.setState({ code: '' });
      this.fetchCode(path);
    }
  }

  async fetchCode(path){
    const response = await fetch(`/sql_probe/event/code?locator=${path}`);
    const { code } = await response.json();
    this.setState({ code });
  }

  scrollToLine = () => {
    const { comp: { codeMirror }, props: { path } } = this;
    const line = getLine(path) - 1;

    codeMirror.setSelection({ line, ch: 0 }, { line });
    codeMirror.scrollIntoView({ line }, codeMirror.getScrollerElement().offsetHeight / 2);
    codeMirror.focus();
  }

  mountCode = comp => {
    this.comp = comp;
    if (comp) {
      comp.codeMirror.on('change', this.scrollToLine);
    }
  }

  render() {
    const { props: { path, className }, state: { code } } = this;
    return (
      <CodeMirror
        ref={this.mountCode}
        className={`Code ${className || ''}`}
        options={{
          lineNumbers: true,
          lineWrapping: true,
          readOnly: true,
          mode: getMode(path)
        }}
        value={code}
      />
    )
  }
}
