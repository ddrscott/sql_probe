module SqlProbe
  module Listener
    module_function

    # Opens a listener for SQL notifications to gather event information
    # @return [Array<ActiveSupport::Notifications::Event>]
    def listen(name:, **params, &block)
      events = []
      previous = nil
      event = nil
      subscription_name = ActiveSupport::Notifications.subscribe('sql.active_record') do |*args|
        event = EventWithCaller.new(*args)

        # calculate elapsed time
        previous.elapsed = (event.time - previous.time) / 1000.0 if previous
        previous = event
        events << event
      end

      begin
        ms = Benchmark.ms { block.call }
        # calc the last event time
        previous.elapsed = (Time.now - previous.time) / 1000.0 if previous

        EventWriter.write_to_file_system(
          name: name,
          duration: ms,
          params: params,
          events: events,
          output_base_path: SqlProbe.output_base_dir
        )
      ensure
        ActiveSupport::Notifications.unsubscribe(subscription_name)
      end
    end
  end
end
