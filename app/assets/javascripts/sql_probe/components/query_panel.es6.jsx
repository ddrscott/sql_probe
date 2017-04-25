class QueryPanel extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const editor = ace.edit(this.refEditor);
    // Automatically scrolling cursor into view after selection change this will be disabled in the next version
    editor.$blockScrolling = Infinity;
    editor.getSession().setMode("ace/mode/sql");
    editor.setReadOnly(true);
    const {sql, binds, elapsed} = this.props;
    const bindComment = binds ? `-- binds: \n` + binds.map( (bind, i) => `--   $${i+1}: ${bind.value}\n` ).join('') : ''
    editor.setValue(`-- elapsed: ${elapsed}\n${bindComment}${sql}`, -1);
  }

  render() {
    return <div className={this.props.className} ref={(elm) => this.refEditor = elm}>{this.props.sql}</div>
  }
}
