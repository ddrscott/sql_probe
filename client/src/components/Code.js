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

  fetchCode(path){
    fetch(`/sql_probe/event/code?locator=${path}`)
      .then(r => r.json())
      .then(data => {
        this.setState({ code: data.code }, () => {
          setTimeout(() => {
            const line = getLine(path) - 1;
            this.comp.codeMirror.doc.setSelection({ line, ch: 0 }, { line, ch: 100000 })
          }, 100); // TODO: figure out codemirror callback when it's done rendering/syntax highlighting
        });
      });
  }

  render() {
    const { props: { path, className }, state: { code } } = this;
    return (
      <CodeMirror
        ref={comp => this.comp = comp}
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
