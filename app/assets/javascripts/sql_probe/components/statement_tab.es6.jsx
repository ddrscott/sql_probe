class StatementTab extends React.Component {

  constructor(props) {
    super(props);

    this.state = {"name":null,
      "time":"2017-04-24T22:08:05.513-05:00",
      "transaction_id":"4cd72ad09a6b183223bd",
      "end":"2017-04-24T22:08:05.514-05:00",
      "children":[],
      "duration":0.633,
      "caller":["/Users/scott.pierce/code/hipaatitis/app/views/appointments/_calendar.erb:10:in `_app_views_appointments__calendar_erb__3395201065767941321_70313359100520'",
      "/Users/scott.pierce/code/hipaatitis/app/views/appointments/index.erb:1:in `_app_views_appointments_index_erb__3559067694734343123_70313406301500'",
      "/Users/scott.pierce/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'",
      "/Users/scott.pierce/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'"],
      "elapsed":5.713,
      "sql":"SELECT COUNT(*) FROM \"appointments\" WHERE (\"appointments\".\"when\" BETWEEN $1 AND $2)",
      "connection_id":70313336537100,
      "statement_name":null,
      "binds":[{"name":"when",
        "value_before_type_cast":"2017-04-01",
        "type":{"precision":null,
          "scale":null,
          "limit":null},
        "original_attribute":null,
        "value":"2017-04-01",
        "value_for_database":"2017-04-01"},
      {"name":"when",
        "value_before_type_cast":"2017-04-30",
        "type":{"precision":null,
          "scale":null,
          "limit":null},
        "original_attribute":null,
        "value":"2017-04-30",
        "value_for_database":"2017-04-30"}]}
    
    if (!SqlProbe.development) {
      this.state = {}
    }
  }


  componentDidMount() {

    document.addEventListener('sql_probe.selected.sql.event', (event) => {
      this.setState(event.detail);
      console.log(event.detail);
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
    editor.setValue(`-- elapsed: ${elapsed}\n${bindComment}${sql}`);
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
