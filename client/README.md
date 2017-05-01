# SQL Probe UI

Web frontend for visualzing the SQL trace data collected by [SQL Probe](https://github.com/ddrscott/sql_probe)

## Developing

    > foreman start

In a browser go to http://localhost:3002/

### How this works?

Browser -> Webpack Dev Server -> Rails Server

## Building for production

    > yarn build
    > cd "where your rails app using sql_probe"
    > bundle exec rails server

In a browser go to http://localhost:3000/sql_probe/live
