module SqlProbe
  module Listener
    module_function

    # Opens a listener for SQL notifications to gather event information
    # @return [Array<ActiveSupport::Notifications::Event>]
    def listen(name:, **params, &block)
      events = []
      previous = nil
      event = nil

      recorder = lambda do |type, args|
        event = EventWithCaller.new(type, *args)

        # calculate elapsed time
        previous.elapsed = (event.time - previous.time) * 1000.0 if previous
        previous = event
        events << event
      end

      subscriptions = %w(instantiation.active_record sql.active_record).map do |type|
        ActiveSupport::Notifications.subscribe(type) { |*args| recorder[type, args] }
      end

      begin
        start_time = Time.now.to_f
        ms = Benchmark.ms { block.call }
        # calc the last event time
        previous.elapsed = (Time.now - previous.time) * 1000.0 if previous

        EventSetWriter.write_to_file_system(
          name: name,
          duration: ms,
          start_time: start_time,
          params: params,
          events: events,
          output_base_path: SqlProbe.output_base_dir
        )
      ensure
        subscriptions.each { |sub| ActiveSupport::Notifications.unsubscribe(sub) }
      end
    end
  end
end
