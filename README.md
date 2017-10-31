# SQL Probe

SQL Probe is a tool to trace SQL utilization in your application
and provides a UI investigate how tables are accessed.

The tools is useful for discovering:
- N+1 queries
- unexpected inserts, updates and deletes
- overloaded controller actions
- most frequently accessed tables

## Setup

To get started, include our action listener to the top most controller
in your Rails application.

```ruby
class ApplicationController < ActionController::Base 
  include SqlProbe::RequestListener
end
```

This effectively sets up an `around_action` which registers an
`ActiveSupport::Notification` listener for 'sql.active_record' and starts
writing structured SQL logs to disk associated with request data. The data is
stored at `SqlProbe.output_base_dir` which defaults to `tmp/sql_probe`.

Next step is to mount the engine to engine to your application.

```ruby
# config/routes.rb
mount SqlProbe::Engine => '/sql_probe'
```

## Probing the SQL

Restart your application and go to `http://localhost:3000/sql_probe`.
By default listening is not enabled. Click the "Start Listening" button located
at the upper right to start listening.

Open a new browser window and poke around your application. To generate some SQL
logs. Then return to `/sql_probe` to see the summary information. From this
point feel free to click around the UI. Help panels are in the UI to guide you
through the process.

