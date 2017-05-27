const OFFSET = 300;
export default [
  {
    "id": 1494273761990.4903522 + OFFSET,
    "name": "people#show",
    "start_time": 1494273761990.4903522 + OFFSET,
    "duration": 277.65500000678003,
    "type": "rails.controller",
    "time": 1494273761990 + OFFSET,
    "end": 1494273762267 + OFFSET,
    "events": []
  },
  {
    "id": 1494273761.4903522,
    "name": "people#show",
    "start_time": 1494273761.4903522,
    "duration": 177.65500000678003,
    "params": {
      "month": "2017-08-01",
      "controller": "people",
      "action": "show"
    },
    "events": [
      {
        "name": "SELECT  \"people\".* FROM \"people\" WHERE \"people\".\"id\" = $1 LIMIT $2",
        "time": 1494273761490,
        "transaction_id": "64690e49d42b74dc051b",
        "end": 1494273761490.476,
        "children": [],
        "duration": 0.47600000000000003,
        "type": "sql.active_record",
        "caller": [
          "/Users/peter.wong/projects/hipaatitis/app/controllers/people_controller.rb:11:in `find_person'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'"
        ],
        "elapsed": 3.8649999999999998,
        "sql": "SELECT  \"people\".* FROM \"people\" WHERE \"people\".\"id\" = $1 LIMIT $2",
        "connection_id": 70207101425160,
        "statement_name": "a1",
        "binds": [
          {
            "name": "id",
            "value_before_type_cast": 40,
            "type": {
              "precision": null,
              "scale": null,
              "limit": null,
              "range": "-2147483648...2147483648"
            },
            "original_attribute": null,
            "value": 40,
            "value_for_database": 40
          },
          {
            "name": "LIMIT",
            "value_before_type_cast": 1,
            "type": {
              "precision": null,
              "scale": null,
              "limit": null
            },
            "original_attribute": null,
            "value": 1
          }
        ],
        "id": "1494273761.4903522-0",
        "color": "#36A2EB"
      },
      {
        "name": "instantiation.active_record",
        "time": 1494273761494,
        "transaction_id": "d3c03a0b72e74f44bf8b",
        "end": 1494273761494.104,
        "children": [],
        "duration": 0.104,
        "type": "instantiation.active_record",
        "caller": [
          "/Users/peter.wong/projects/hipaatitis/app/controllers/people_controller.rb:11:in `find_person'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'"
        ],
        "elapsed": 15.417,
        "record_count": 1,
        "class_name": "Person",
        "id": "1494273761.4903522-1",
        "color": "#FFCE56"
      },
      {
        "name": "SELECT  \"people\".* FROM \"people\" WHERE \"people\".\"id\" = $1 LIMIT $2",
        "time": 1494273761509,
        "transaction_id": "d3c03a0b72e74f44bf8b",
        "end": 1494273761509.321,
        "children": [],
        "duration": 0.321,
        "type": "sql.active_record",
        "caller": [
          "/Users/peter.wong/projects/hipaatitis/app/controllers/application_controller.rb:6:in `current_user'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/_appointment_calendar.erb:9:in `_app_views_people__appointment_calendar_erb___3225354459222082705_70207044942800'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/show.erb:1:in `_app_views_people_show_erb__2040633201175668322_70207045051940'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'"
        ],
        "elapsed": 5.4190000000000005,
        "sql": "SELECT  \"people\".* FROM \"people\" WHERE \"people\".\"id\" = $1 LIMIT $2",
        "binds": [
          {
            "name": "id",
            "value_before_type_cast": 40,
            "type": {
              "precision": null,
              "scale": null,
              "limit": null,
              "range": "-2147483648...2147483648"
            },
            "original_attribute": null,
            "value": 40,
            "value_for_database": 40
          },
          {
            "name": "LIMIT",
            "value_before_type_cast": 1,
            "type": {
              "precision": null,
              "scale": null,
              "limit": null
            },
            "original_attribute": null,
            "value": 1
          }
        ],
        "connection_id": 70207101425160,
        "id": "1494273761.4903522-2",
        "color": "#36A2EB"
      },
      {
        "name": "instantiation.active_record",
        "time": 1494273761515,
        "transaction_id": "d3c03a0b72e74f44bf8b",
        "end": 1494273761515.175,
        "children": [],
        "duration": 0.175,
        "type": "instantiation.active_record",
        "caller": [
          "/Users/peter.wong/projects/hipaatitis/app/controllers/application_controller.rb:6:in `current_user'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/_appointment_calendar.erb:9:in `_app_views_people__appointment_calendar_erb___3225354459222082705_70207044942800'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/show.erb:1:in `_app_views_people_show_erb__2040633201175668322_70207045051940'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'"
        ],
        "elapsed": 6.9750000000000005,
        "record_count": 1,
        "class_name": "Person",
        "id": "1494273761.4903522-3",
        "color": "#FFCE56"
      },
      {
        "name": "SELECT COUNT(*) FROM \"appointments\" INNER JOIN \"attendants\" ON \"appointments\".\"id\" = \"attendants\".\"appointment_id\" WHERE \"attendants\".\"person_id\" = $1",
        "time": 1494273761522,
        "transaction_id": "64690e49d42b74dc051b",
        "end": 1494273761523.08,
        "children": [],
        "duration": 1.08,
        "type": "sql.active_record",
        "caller": [
          "/Users/peter.wong/projects/hipaatitis/app/views/people/_appointment_calendar.erb:11:in `_app_views_people__appointment_calendar_erb___3225354459222082705_70207044942800'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/show.erb:1:in `_app_views_people_show_erb__2040633201175668322_70207045051940'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'"
        ],
        "elapsed": 9.513,
        "sql": "SELECT COUNT(*) FROM \"appointments\" INNER JOIN \"attendants\" ON \"appointments\".\"id\" = \"attendants\".\"appointment_id\" WHERE \"attendants\".\"person_id\" = $1",
        "connection_id": 70207101425160,
        "statement_name": null,
        "binds": [
          {
            "name": "person_id",
            "value_before_type_cast": 40,
            "type": {
              "precision": null,
              "scale": null,
              "limit": null,
              "range": "-2147483648...2147483648"
            },
            "original_attribute": null,
            "value": 40,
            "value_for_database": 40
          }
        ],
        "id": "1494273761.4903522-4",
        "color": "#36A2EB"
      },
      {
        "name": "SELECT \"appointments\".* FROM \"appointments\" INNER JOIN \"attendants\" ON \"appointments\".\"id\" = \"attendants\".\"appointment_id\" WHERE \"attendants\".\"person_id\" = $1",
        "time": 1494273761531,
        "transaction_id": "64690e49d42b74dc051b",
        "end": 1494273761531.706,
        "children": [],
        "duration": 0.7060000000000001,
        "type": "sql.active_record",
        "caller": [
          "/Users/peter.wong/projects/hipaatitis/app/views/shared/_appointments.erb:4:in `group_by'",
          "/Users/peter.wong/projects/hipaatitis/app/views/shared/_appointments.erb:4:in `_app_views_shared__appointments_erb___3707199204078703114_70207049021740'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/_appointment_calendar.erb:15:in `_app_views_people__appointment_calendar_erb___3225354459222082705_70207044942800'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/show.erb:1:in `_app_views_people_show_erb__2040633201175668322_70207045051940'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'"
        ],
        "elapsed": 4.43,
        "sql": "SELECT \"appointments\".* FROM \"appointments\" INNER JOIN \"attendants\" ON \"appointments\".\"id\" = \"attendants\".\"appointment_id\" WHERE \"attendants\".\"person_id\" = $1",
        "connection_id": 70207101425160,
        "statement_name": null,
        "binds": [
          {
            "name": "person_id",
            "value_before_type_cast": 40,
            "type": {
              "precision": null,
              "scale": null,
              "limit": null,
              "range": "-2147483648...2147483648"
            },
            "original_attribute": null,
            "value": 40,
            "value_for_database": 40
          }
        ],
        "id": "1494273761.4903522-5",
        "color": "#36A2EB"
      },
      {
        "name": "instantiation.active_record",
        "time": 1494273761536,
        "transaction_id": "d3c03a0b72e74f44bf8b",
        "end": 1494273761536.116,
        "children": [],
        "duration": 0.116,
        "type": "instantiation.active_record",
        "caller": [
          "/Users/peter.wong/projects/hipaatitis/app/views/shared/_appointments.erb:4:in `group_by'",
          "/Users/peter.wong/projects/hipaatitis/app/views/shared/_appointments.erb:4:in `_app_views_shared__appointments_erb___3707199204078703114_70207049021740'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/_appointment_calendar.erb:15:in `_app_views_people__appointment_calendar_erb___3225354459222082705_70207044942800'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/show.erb:1:in `_app_views_people_show_erb__2040633201175668322_70207045051940'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'"
        ],
        "elapsed": 9.653,
        "record_count": 3,
        "class_name": "Appointment",
        "id": "1494273761.4903522-6",
        "color": "#FFCE56"
      },
      {
        "name": "SELECT \"appointments\".* FROM \"appointments\" INNER JOIN \"attendants\" ON \"appointments\".\"id\" = \"attendants\".\"appointment_id\" WHERE \"attendants\".\"person_id\" = $1 ORDER BY \"appointments\".\"when\" ASC",
        "time": 1494273761545,
        "transaction_id": "64690e49d42b74dc051b",
        "end": 1494273761545.97,
        "children": [],
        "duration": 0.9700000000000001,
        "type": "sql.active_record",
        "caller": [
          "/Users/peter.wong/projects/hipaatitis/app/views/people/_appointment_list.erb:12:in `_app_views_people__appointment_list_erb___2251091856107804495_70207048188640'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/show.erb:2:in `_app_views_people_show_erb__2040633201175668322_70207045051940'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'"
        ],
        "elapsed": 4.595,
        "sql": "SELECT \"appointments\".* FROM \"appointments\" INNER JOIN \"attendants\" ON \"appointments\".\"id\" = \"attendants\".\"appointment_id\" WHERE \"attendants\".\"person_id\" = $1 ORDER BY \"appointments\".\"when\" ASC",
        "connection_id": 70207101425160,
        "statement_name": null,
        "binds": [
          {
            "name": "person_id",
            "value_before_type_cast": 40,
            "type": {
              "precision": null,
              "scale": null,
              "limit": null,
              "range": "-2147483648...2147483648"
            },
            "original_attribute": null,
            "value": 40,
            "value_for_database": 40
          }
        ],
        "id": "1494273761.4903522-7",
        "color": "#36A2EB"
      },
      {
        "name": "instantiation.active_record",
        "time": 1494273761550,
        "transaction_id": "d3c03a0b72e74f44bf8b",
        "end": 1494273761550.099,
        "children": [],
        "duration": 0.09899999999999999,
        "type": "instantiation.active_record",
        "caller": [
          "/Users/peter.wong/projects/hipaatitis/app/views/people/_appointment_list.erb:12:in `_app_views_people__appointment_list_erb___2251091856107804495_70207048188640'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/show.erb:2:in `_app_views_people_show_erb__2040633201175668322_70207045051940'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'"
        ],
        "elapsed": 6.678,
        "record_count": 3,
        "class_name": "Appointment",
        "id": "1494273761.4903522-8",
        "color": "#FFCE56"
      },
      {
        "name": "SELECT \"attendants\".* FROM \"attendants\" WHERE \"attendants\".\"appointment_id\" = $1",
        "time": 1494273761557,
        "transaction_id": "64690e49d42b74dc051b",
        "end": 1494273761557.444,
        "children": [],
        "duration": 0.444,
        "type": "sql.active_record",
        "caller": [
          "/Users/peter.wong/projects/hipaatitis/app/helpers/application_helper.rb:13:in `reject'",
          "/Users/peter.wong/projects/hipaatitis/app/helpers/application_helper.rb:13:in `attendant_links'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/_appointment_list.erb:20:in `block in _app_views_people__appointment_list_erb___2251091856107804495_70207048188640'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/_appointment_list.erb:12:in `_app_views_people__appointment_list_erb___2251091856107804495_70207048188640'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/show.erb:2:in `_app_views_people_show_erb__2040633201175668322_70207045051940'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'"
        ],
        "elapsed": 5.2170000000000005,
        "sql": "SELECT \"attendants\".* FROM \"attendants\" WHERE \"attendants\".\"appointment_id\" = $1",
        "connection_id": 70207101425160,
        "statement_name": "a3",
        "binds": [
          {
            "name": "appointment_id",
            "value_before_type_cast": 48,
            "type": {
              "precision": null,
              "scale": null,
              "limit": null,
              "range": "-2147483648...2147483648"
            },
            "original_attribute": null,
            "value": 48,
            "value_for_database": 48
          }
        ],
        "id": "1494273761.4903522-9",
        "color": "#36A2EB"
      },
      {
        "name": "instantiation.active_record",
        "time": 1494273761562,
        "transaction_id": "d3c03a0b72e74f44bf8b",
        "end": 1494273761562.201,
        "children": [],
        "duration": 0.201,
        "type": "instantiation.active_record",
        "caller": [
          "/Users/peter.wong/projects/hipaatitis/app/helpers/application_helper.rb:13:in `reject'",
          "/Users/peter.wong/projects/hipaatitis/app/helpers/application_helper.rb:13:in `attendant_links'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/_appointment_list.erb:20:in `block in _app_views_people__appointment_list_erb___2251091856107804495_70207048188640'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/_appointment_list.erb:12:in `_app_views_people__appointment_list_erb___2251091856107804495_70207048188640'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/show.erb:2:in `_app_views_people_show_erb__2040633201175668322_70207045051940'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'"
        ],
        "elapsed": 4.568,
        "record_count": 2,
        "class_name": "Attendant",
        "id": "1494273761.4903522-10",
        "color": "#FFCE56"
      },
      {
        "name": "SELECT  \"people\".* FROM \"people\" WHERE \"people\".\"id\" = $1 LIMIT $2",
        "time": 1494273761566,
        "transaction_id": "d3c03a0b72e74f44bf8b",
        "end": 1494273761566.161,
        "children": [],
        "duration": 0.161,
        "type": "sql.active_record",
        "caller": [
          "/Users/peter.wong/projects/hipaatitis/app/helpers/application_helper.rb:13:in `block in attendant_links'",
          "/Users/peter.wong/projects/hipaatitis/app/helpers/application_helper.rb:13:in `reject'",
          "/Users/peter.wong/projects/hipaatitis/app/helpers/application_helper.rb:13:in `attendant_links'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/_appointment_list.erb:20:in `block in _app_views_people__appointment_list_erb___2251091856107804495_70207048188640'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/_appointment_list.erb:12:in `_app_views_people__appointment_list_erb___2251091856107804495_70207048188640'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/show.erb:2:in `_app_views_people_show_erb__2040633201175668322_70207045051940'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'"
        ],
        "elapsed": 3.754,
        "sql": "SELECT  \"people\".* FROM \"people\" WHERE \"people\".\"id\" = $1 LIMIT $2",
        "binds": [
          {
            "name": "id",
            "value_before_type_cast": 40,
            "type": {
              "precision": null,
              "scale": null,
              "limit": null,
              "range": "-2147483648...2147483648"
            },
            "original_attribute": null,
            "value": 40,
            "value_for_database": 40
          },
          {
            "name": "LIMIT",
            "value_before_type_cast": 1,
            "type": {
              "precision": null,
              "scale": null,
              "limit": null
            },
            "original_attribute": null,
            "value": 1
          }
        ],
        "connection_id": 70207101425160,
        "id": "1494273761.4903522-11",
        "color": "#36A2EB"
      },
      {
        "name": "instantiation.active_record",
        "time": 1494273761570,
        "transaction_id": "d3c03a0b72e74f44bf8b",
        "end": 1494273761570.105,
        "children": [],
        "duration": 0.10500000000000001,
        "type": "instantiation.active_record",
        "caller": [
          "/Users/peter.wong/projects/hipaatitis/app/helpers/application_helper.rb:13:in `block in attendant_links'",
          "/Users/peter.wong/projects/hipaatitis/app/helpers/application_helper.rb:13:in `reject'",
          "/Users/peter.wong/projects/hipaatitis/app/helpers/application_helper.rb:13:in `attendant_links'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/_appointment_list.erb:20:in `block in _app_views_people__appointment_list_erb___2251091856107804495_70207048188640'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/_appointment_list.erb:12:in `_app_views_people__appointment_list_erb___2251091856107804495_70207048188640'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/show.erb:2:in `_app_views_people_show_erb__2040633201175668322_70207045051940'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'"
        ],
        "elapsed": 3.571,
        "record_count": 1,
        "class_name": "Person",
        "id": "1494273761.4903522-12",
        "color": "#FFCE56"
      },
      {
        "name": "SELECT  \"people\".* FROM \"people\" WHERE \"people\".\"id\" = $1 LIMIT $2",
        "time": 1494273761574,
        "transaction_id": "64690e49d42b74dc051b",
        "end": 1494273761574.498,
        "children": [],
        "duration": 0.49799999999999994,
        "type": "sql.active_record",
        "caller": [
          "/Users/peter.wong/projects/hipaatitis/app/helpers/application_helper.rb:13:in `block in attendant_links'",
          "/Users/peter.wong/projects/hipaatitis/app/helpers/application_helper.rb:13:in `reject'",
          "/Users/peter.wong/projects/hipaatitis/app/helpers/application_helper.rb:13:in `attendant_links'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/_appointment_list.erb:20:in `block in _app_views_people__appointment_list_erb___2251091856107804495_70207048188640'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/_appointment_list.erb:12:in `_app_views_people__appointment_list_erb___2251091856107804495_70207048188640'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/show.erb:2:in `_app_views_people_show_erb__2040633201175668322_70207045051940'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'"
        ],
        "elapsed": 12.567,
        "sql": "SELECT  \"people\".* FROM \"people\" WHERE \"people\".\"id\" = $1 LIMIT $2",
        "connection_id": 70207101425160,
        "statement_name": "a1",
        "binds": [
          {
            "name": "id",
            "value_before_type_cast": 64,
            "type": {
              "precision": null,
              "scale": null,
              "limit": null,
              "range": "-2147483648...2147483648"
            },
            "original_attribute": null,
            "value": 64,
            "value_for_database": 64
          },
          {
            "name": "LIMIT",
            "value_before_type_cast": 1,
            "type": {
              "precision": null,
              "scale": null,
              "limit": null
            },
            "original_attribute": null,
            "value": 1
          }
        ],
        "id": "1494273761.4903522-13",
        "color": "#36A2EB"
      },
      {
        "name": "instantiation.active_record",
        "time": 1494273761586,
        "transaction_id": "d3c03a0b72e74f44bf8b",
        "end": 1494273761586.053,
        "children": [],
        "duration": 0.053,
        "type": "instantiation.active_record",
        "caller": [
          "/Users/peter.wong/projects/hipaatitis/app/helpers/application_helper.rb:13:in `block in attendant_links'",
          "/Users/peter.wong/projects/hipaatitis/app/helpers/application_helper.rb:13:in `reject'",
          "/Users/peter.wong/projects/hipaatitis/app/helpers/application_helper.rb:13:in `attendant_links'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/_appointment_list.erb:20:in `block in _app_views_people__appointment_list_erb___2251091856107804495_70207048188640'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/_appointment_list.erb:12:in `_app_views_people__appointment_list_erb___2251091856107804495_70207048188640'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/show.erb:2:in `_app_views_people_show_erb__2040633201175668322_70207045051940'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'"
        ],
        "elapsed": 6.28,
        "record_count": 1,
        "class_name": "Person",
        "id": "1494273761.4903522-14",
        "color": "#FFCE56"
      },
      {
        "name": "SELECT \"attendants\".* FROM \"attendants\" WHERE \"attendants\".\"appointment_id\" = $1",
        "time": 1494273761593,
        "transaction_id": "64690e49d42b74dc051b",
        "end": 1494273761593.444,
        "children": [],
        "duration": 0.444,
        "type": "sql.active_record",
        "caller": [
          "/Users/peter.wong/projects/hipaatitis/app/helpers/application_helper.rb:13:in `reject'",
          "/Users/peter.wong/projects/hipaatitis/app/helpers/application_helper.rb:13:in `attendant_links'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/_appointment_list.erb:20:in `block in _app_views_people__appointment_list_erb___2251091856107804495_70207048188640'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/_appointment_list.erb:12:in `_app_views_people__appointment_list_erb___2251091856107804495_70207048188640'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/show.erb:2:in `_app_views_people_show_erb__2040633201175668322_70207045051940'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'"
        ],
        "elapsed": 4.438,
        "sql": "SELECT \"attendants\".* FROM \"attendants\" WHERE \"attendants\".\"appointment_id\" = $1",
        "connection_id": 70207101425160,
        "statement_name": "a3",
        "binds": [
          {
            "name": "appointment_id",
            "value_before_type_cast": 47,
            "type": {
              "precision": null,
              "scale": null,
              "limit": null,
              "range": "-2147483648...2147483648"
            },
            "original_attribute": null,
            "value": 47,
            "value_for_database": 47
          }
        ],
        "id": "1494273761.4903522-15",
        "color": "#36A2EB"
      },
      {
        "name": "instantiation.active_record",
        "time": 1494273761597,
        "transaction_id": "d3c03a0b72e74f44bf8b",
        "end": 1494273761597.176,
        "children": [],
        "duration": 0.176,
        "type": "instantiation.active_record",
        "caller": [
          "/Users/peter.wong/projects/hipaatitis/app/helpers/application_helper.rb:13:in `reject'",
          "/Users/peter.wong/projects/hipaatitis/app/helpers/application_helper.rb:13:in `attendant_links'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/_appointment_list.erb:20:in `block in _app_views_people__appointment_list_erb___2251091856107804495_70207048188640'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/_appointment_list.erb:12:in `_app_views_people__appointment_list_erb___2251091856107804495_70207048188640'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/show.erb:2:in `_app_views_people_show_erb__2040633201175668322_70207045051940'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'"
        ],
        "elapsed": 3.847,
        "record_count": 2,
        "class_name": "Attendant",
        "id": "1494273761.4903522-16",
        "color": "#FFCE56"
      },
      {
        "name": "SELECT  \"people\".* FROM \"people\" WHERE \"people\".\"id\" = $1 LIMIT $2",
        "time": 1494273761601,
        "transaction_id": "d3c03a0b72e74f44bf8b",
        "end": 1494273761601.162,
        "children": [],
        "duration": 0.162,
        "type": "sql.active_record",
        "caller": [
          "/Users/peter.wong/projects/hipaatitis/app/helpers/application_helper.rb:13:in `block in attendant_links'",
          "/Users/peter.wong/projects/hipaatitis/app/helpers/application_helper.rb:13:in `reject'",
          "/Users/peter.wong/projects/hipaatitis/app/helpers/application_helper.rb:13:in `attendant_links'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/_appointment_list.erb:20:in `block in _app_views_people__appointment_list_erb___2251091856107804495_70207048188640'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/_appointment_list.erb:12:in `_app_views_people__appointment_list_erb___2251091856107804495_70207048188640'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/show.erb:2:in `_app_views_people_show_erb__2040633201175668322_70207045051940'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'"
        ],
        "elapsed": 3.4650000000000003,
        "sql": "SELECT  \"people\".* FROM \"people\" WHERE \"people\".\"id\" = $1 LIMIT $2",
        "binds": [
          {
            "name": "id",
            "value_before_type_cast": 40,
            "type": {
              "precision": null,
              "scale": null,
              "limit": null,
              "range": "-2147483648...2147483648"
            },
            "original_attribute": null,
            "value": 40,
            "value_for_database": 40
          },
          {
            "name": "LIMIT",
            "value_before_type_cast": 1,
            "type": {
              "precision": null,
              "scale": null,
              "limit": null
            },
            "original_attribute": null,
            "value": 1
          }
        ],
        "connection_id": 70207101425160,
        "id": "1494273761.4903522-17",
        "color": "#36A2EB"
      },
      {
        "name": "instantiation.active_record",
        "time": 1494273761604,
        "transaction_id": "d3c03a0b72e74f44bf8b",
        "end": 1494273761604.097,
        "children": [],
        "duration": 0.097,
        "type": "instantiation.active_record",
        "caller": [
          "/Users/peter.wong/projects/hipaatitis/app/helpers/application_helper.rb:13:in `block in attendant_links'",
          "/Users/peter.wong/projects/hipaatitis/app/helpers/application_helper.rb:13:in `reject'",
          "/Users/peter.wong/projects/hipaatitis/app/helpers/application_helper.rb:13:in `attendant_links'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/_appointment_list.erb:20:in `block in _app_views_people__appointment_list_erb___2251091856107804495_70207048188640'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/_appointment_list.erb:12:in `_app_views_people__appointment_list_erb___2251091856107804495_70207048188640'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/show.erb:2:in `_app_views_people_show_erb__2040633201175668322_70207045051940'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'"
        ],
        "elapsed": 4.015000000000001,
        "record_count": 1,
        "class_name": "Person",
        "id": "1494273761.4903522-18",
        "color": "#FFCE56"
      },
      {
        "name": "SELECT  \"people\".* FROM \"people\" WHERE \"people\".\"id\" = $1 LIMIT $2",
        "time": 1494273761608,
        "transaction_id": "64690e49d42b74dc051b",
        "end": 1494273761608.446,
        "children": [],
        "duration": 0.446,
        "type": "sql.active_record",
        "caller": [
          "/Users/peter.wong/projects/hipaatitis/app/helpers/application_helper.rb:13:in `block in attendant_links'",
          "/Users/peter.wong/projects/hipaatitis/app/helpers/application_helper.rb:13:in `reject'",
          "/Users/peter.wong/projects/hipaatitis/app/helpers/application_helper.rb:13:in `attendant_links'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/_appointment_list.erb:20:in `block in _app_views_people__appointment_list_erb___2251091856107804495_70207048188640'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/_appointment_list.erb:12:in `_app_views_people__appointment_list_erb___2251091856107804495_70207048188640'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/show.erb:2:in `_app_views_people_show_erb__2040633201175668322_70207045051940'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'"
        ],
        "elapsed": 4.312,
        "sql": "SELECT  \"people\".* FROM \"people\" WHERE \"people\".\"id\" = $1 LIMIT $2",
        "connection_id": 70207101425160,
        "statement_name": "a1",
        "binds": [
          {
            "name": "id",
            "value_before_type_cast": 65,
            "type": {
              "precision": null,
              "scale": null,
              "limit": null,
              "range": "-2147483648...2147483648"
            },
            "original_attribute": null,
            "value": 65,
            "value_for_database": 65
          },
          {
            "name": "LIMIT",
            "value_before_type_cast": 1,
            "type": {
              "precision": null,
              "scale": null,
              "limit": null
            },
            "original_attribute": null,
            "value": 1
          }
        ],
        "id": "1494273761.4903522-19",
        "color": "#36A2EB"
      },
      {
        "name": "instantiation.active_record",
        "time": 1494273761613,
        "transaction_id": "d3c03a0b72e74f44bf8b",
        "end": 1494273761613.066,
        "children": [],
        "duration": 0.066,
        "type": "instantiation.active_record",
        "caller": [
          "/Users/peter.wong/projects/hipaatitis/app/helpers/application_helper.rb:13:in `block in attendant_links'",
          "/Users/peter.wong/projects/hipaatitis/app/helpers/application_helper.rb:13:in `reject'",
          "/Users/peter.wong/projects/hipaatitis/app/helpers/application_helper.rb:13:in `attendant_links'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/_appointment_list.erb:20:in `block in _app_views_people__appointment_list_erb___2251091856107804495_70207048188640'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/_appointment_list.erb:12:in `_app_views_people__appointment_list_erb___2251091856107804495_70207048188640'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/show.erb:2:in `_app_views_people_show_erb__2040633201175668322_70207045051940'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'"
        ],
        "elapsed": 5.936999999999999,
        "record_count": 1,
        "class_name": "Person",
        "id": "1494273761.4903522-20",
        "color": "#FFCE56"
      },
      {
        "name": "SELECT \"attendants\".* FROM \"attendants\" WHERE \"attendants\".\"appointment_id\" = $1",
        "time": 1494273761619,
        "transaction_id": "64690e49d42b74dc051b",
        "end": 1494273761619.449,
        "children": [],
        "duration": 0.449,
        "type": "sql.active_record",
        "caller": [
          "/Users/peter.wong/projects/hipaatitis/app/helpers/application_helper.rb:13:in `reject'",
          "/Users/peter.wong/projects/hipaatitis/app/helpers/application_helper.rb:13:in `attendant_links'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/_appointment_list.erb:20:in `block in _app_views_people__appointment_list_erb___2251091856107804495_70207048188640'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/_appointment_list.erb:12:in `_app_views_people__appointment_list_erb___2251091856107804495_70207048188640'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/show.erb:2:in `_app_views_people_show_erb__2040633201175668322_70207045051940'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'"
        ],
        "elapsed": 3.75,
        "sql": "SELECT \"attendants\".* FROM \"attendants\" WHERE \"attendants\".\"appointment_id\" = $1",
        "connection_id": 70207101425160,
        "statement_name": "a3",
        "binds": [
          {
            "name": "appointment_id",
            "value_before_type_cast": 46,
            "type": {
              "precision": null,
              "scale": null,
              "limit": null,
              "range": "-2147483648...2147483648"
            },
            "original_attribute": null,
            "value": 46,
            "value_for_database": 46
          }
        ],
        "id": "1494273761.4903522-21",
        "color": "#36A2EB"
      },
      {
        "name": "instantiation.active_record",
        "time": 1494273761622,
        "transaction_id": "d3c03a0b72e74f44bf8b",
        "end": 1494273761622.154,
        "children": [],
        "duration": 0.154,
        "type": "instantiation.active_record",
        "caller": [
          "/Users/peter.wong/projects/hipaatitis/app/helpers/application_helper.rb:13:in `reject'",
          "/Users/peter.wong/projects/hipaatitis/app/helpers/application_helper.rb:13:in `attendant_links'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/_appointment_list.erb:20:in `block in _app_views_people__appointment_list_erb___2251091856107804495_70207048188640'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/_appointment_list.erb:12:in `_app_views_people__appointment_list_erb___2251091856107804495_70207048188640'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/show.erb:2:in `_app_views_people_show_erb__2040633201175668322_70207045051940'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'"
        ],
        "elapsed": 4.258,
        "record_count": 2,
        "class_name": "Attendant",
        "id": "1494273761.4903522-22",
        "color": "#FFCE56"
      },
      {
        "name": "SELECT  \"people\".* FROM \"people\" WHERE \"people\".\"id\" = $1 LIMIT $2",
        "time": 1494273761627,
        "transaction_id": "d3c03a0b72e74f44bf8b",
        "end": 1494273761627.19,
        "children": [],
        "duration": 0.19,
        "type": "sql.active_record",
        "caller": [
          "/Users/peter.wong/projects/hipaatitis/app/helpers/application_helper.rb:13:in `block in attendant_links'",
          "/Users/peter.wong/projects/hipaatitis/app/helpers/application_helper.rb:13:in `reject'",
          "/Users/peter.wong/projects/hipaatitis/app/helpers/application_helper.rb:13:in `attendant_links'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/_appointment_list.erb:20:in `block in _app_views_people__appointment_list_erb___2251091856107804495_70207048188640'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/_appointment_list.erb:12:in `_app_views_people__appointment_list_erb___2251091856107804495_70207048188640'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/show.erb:2:in `_app_views_people_show_erb__2040633201175668322_70207045051940'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'"
        ],
        "elapsed": 3.883,
        "sql": "SELECT  \"people\".* FROM \"people\" WHERE \"people\".\"id\" = $1 LIMIT $2",
        "binds": [
          {
            "name": "id",
            "value_before_type_cast": 40,
            "type": {
              "precision": null,
              "scale": null,
              "limit": null,
              "range": "-2147483648...2147483648"
            },
            "original_attribute": null,
            "value": 40,
            "value_for_database": 40
          },
          {
            "name": "LIMIT",
            "value_before_type_cast": 1,
            "type": {
              "precision": null,
              "scale": null,
              "limit": null
            },
            "original_attribute": null,
            "value": 1
          }
        ],
        "connection_id": 70207101425160,
        "id": "1494273761.4903522-23",
        "color": "#36A2EB"
      },
      {
        "name": "instantiation.active_record",
        "time": 1494273761631,
        "transaction_id": "d3c03a0b72e74f44bf8b",
        "end": 1494273761631.089,
        "children": [],
        "duration": 0.089,
        "type": "instantiation.active_record",
        "caller": [
          "/Users/peter.wong/projects/hipaatitis/app/helpers/application_helper.rb:13:in `block in attendant_links'",
          "/Users/peter.wong/projects/hipaatitis/app/helpers/application_helper.rb:13:in `reject'",
          "/Users/peter.wong/projects/hipaatitis/app/helpers/application_helper.rb:13:in `attendant_links'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/_appointment_list.erb:20:in `block in _app_views_people__appointment_list_erb___2251091856107804495_70207048188640'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/_appointment_list.erb:12:in `_app_views_people__appointment_list_erb___2251091856107804495_70207048188640'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/show.erb:2:in `_app_views_people_show_erb__2040633201175668322_70207045051940'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'"
        ],
        "elapsed": 4.108,
        "record_count": 1,
        "class_name": "Person",
        "id": "1494273761.4903522-24",
        "color": "#FFCE56"
      },
      {
        "name": "SELECT  \"people\".* FROM \"people\" WHERE \"people\".\"id\" = $1 LIMIT $2",
        "time": 1494273761635,
        "transaction_id": "64690e49d42b74dc051b",
        "end": 1494273761635.478,
        "children": [],
        "duration": 0.47800000000000004,
        "type": "sql.active_record",
        "caller": [
          "/Users/peter.wong/projects/hipaatitis/app/helpers/application_helper.rb:13:in `block in attendant_links'",
          "/Users/peter.wong/projects/hipaatitis/app/helpers/application_helper.rb:13:in `reject'",
          "/Users/peter.wong/projects/hipaatitis/app/helpers/application_helper.rb:13:in `attendant_links'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/_appointment_list.erb:20:in `block in _app_views_people__appointment_list_erb___2251091856107804495_70207048188640'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/_appointment_list.erb:12:in `_app_views_people__appointment_list_erb___2251091856107804495_70207048188640'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/show.erb:2:in `_app_views_people_show_erb__2040633201175668322_70207045051940'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'"
        ],
        "elapsed": 3.8960000000000004,
        "sql": "SELECT  \"people\".* FROM \"people\" WHERE \"people\".\"id\" = $1 LIMIT $2",
        "connection_id": 70207101425160,
        "statement_name": "a1",
        "binds": [
          {
            "name": "id",
            "value_before_type_cast": 51,
            "type": {
              "precision": null,
              "scale": null,
              "limit": null,
              "range": "-2147483648...2147483648"
            },
            "original_attribute": null,
            "value": 51,
            "value_for_database": 51
          },
          {
            "name": "LIMIT",
            "value_before_type_cast": 1,
            "type": {
              "precision": null,
              "scale": null,
              "limit": null
            },
            "original_attribute": null,
            "value": 1
          }
        ],
        "id": "1494273761.4903522-25",
        "color": "#36A2EB"
      },
      {
        "name": "instantiation.active_record",
        "time": 1494273761639,
        "transaction_id": "d3c03a0b72e74f44bf8b",
        "end": 1494273761639.055,
        "children": [],
        "duration": 0.055,
        "type": "instantiation.active_record",
        "caller": [
          "/Users/peter.wong/projects/hipaatitis/app/helpers/application_helper.rb:13:in `block in attendant_links'",
          "/Users/peter.wong/projects/hipaatitis/app/helpers/application_helper.rb:13:in `reject'",
          "/Users/peter.wong/projects/hipaatitis/app/helpers/application_helper.rb:13:in `attendant_links'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/_appointment_list.erb:20:in `block in _app_views_people__appointment_list_erb___2251091856107804495_70207048188640'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/_appointment_list.erb:12:in `_app_views_people__appointment_list_erb___2251091856107804495_70207048188640'",
          "/Users/peter.wong/projects/hipaatitis/app/views/people/show.erb:2:in `_app_views_people_show_erb__2040633201175668322_70207045051940'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'",
          "/Users/peter.wong/.rbenv/versions/2.2.3/lib/ruby/2.2.0/benchmark.rb:303:in `realtime'"
        ],
        "elapsed": 28.95,
        "record_count": 1,
        "class_name": "Person",
        "id": "1494273761.4903522-26",
        "color": "#FFCE56"
      }
    ],
    "path": "/Users/peter.wong/projects/hipaatitis/tmp/sql_probe/people#show(2017-08-01)/1494273761.670339.yml",
    "type": "rails.controller",
    "time": 1494273761490,
    "end": 1494273761668,
    "color": "#DDD"
  }
];
