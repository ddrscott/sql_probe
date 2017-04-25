class StatementPanel extends React.Component {

  constructor(props) {
    super(props);

    if (!SqlProbe.development) {
      this.state = {}
    }
  }


  componentDidMount() {

    document.addEventListener('sql_probe.selected.sql.event', (event) => {
      this.setState(event.detail);
      this.updateEditor();
    }, false);

    this.updateEditor();
  }

  componentWillUnmount() {
    // document.removeEventListener
  }

  updateEditor() {
    const editor = ace.edit(this.refEditor);
    // Automatically scrolling cursor into view after selection change this will be disabled in the next version
    editor.$blockScrolling = Infinity;
    editor.getSession().setMode("ace/mode/sql");
    editor.setReadOnly(true);
    const {sql, binds, elapsed} = this.state;
    const bindComment = binds ? `-- binds: \n` + binds.map( (bind, i) => `--   $${i+1}: ${bind.value}\n` ).join('') : ''
    editor.setValue(`-- elapsed: ${elapsed}\n${bindComment}${sql}`, -1);
  }

  render() {
    if (this.state.sql == undefined) {
      return <div>Select a statement to see it here</div> 
    }
    return (
      <div className='full-size' ref={(elm) => {this.refEditor = elm}} />
    )
  }
}
