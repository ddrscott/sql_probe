module SqlProbe
  module Listener
    extend ActiveSupport::Concern

    included do
      around_action :sql_probe_listen
    end

    #
    # Opens a listener for SQL notifications to gather event information
    # @return [Array<ActiveSupport::Notifications::Event>]
    def sql_probe_listen(&block)
      if SqlProbe.listening?
        events = []
        subscription_name = ActiveSupport::Notifications.subscribe('sql.active_record') do |*args|
          event = EventWithCaller.new(*args)
          event.duration  # force duration calculation
          event.caller = caller
          events << event
        end
        begin
          block.call
          write_to_file_system(events: events, output_base_path: SqlProbe.output_base_dir)
          events
        ensure
          ActiveSupport::Notifications.unsubscribe(subscription_name)
        end
      else
        block.call
      end
    end

    def write_to_file_system(events:, output_base_path:)
      # ignore all Rails introspection noise
      events.reject!{|e| e.payload[:name] == 'SCHEMA'}
      return if events.empty?

      # reformat event to be more "readable"
      events.map!{|e| flatten_event_payload(e) }

      file_id = events.first['transaction_id']
      output_dir = output_full_dir(output_base_path, request)
      FileUtils.mkdir_p(output_dir)
      full_path = File.join(output_dir, "#{file_id}.yml")

      # write contents
      File.open(full_path, 'w') do |f|
        params = request.params
        f << {
          'name' => "#{params[:controller]}##{params[:action]}",
          'params' => params,
          'events' => events
        }.to_yaml
      end
    end

    def output_full_dir(output_base_path, request)
      File.join(output_base_path, request.params[:controller], request.params[:action], request.method)
    end

    def flatten_event_payload(event)
      e = event.as_json
      e.merge!(e.delete('payload'))
    end
  end
end
