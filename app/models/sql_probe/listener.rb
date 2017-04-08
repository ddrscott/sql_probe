module SqlProbe
  module Listener
    module_function

    # Opens a listener for SQL notifications to gather event information
    # @return [Array<ActiveSupport::Notifications::Event>]
    def listen(name:, **params, &block)
      events = []
      subscription_name = ActiveSupport::Notifications.subscribe('sql.active_record') do |*args|
        events << EventWithCaller.new(*args)
      end
      begin
        block.call
        EventWriter.write_to_file_system(name: name, params: params, events: events, output_base_path: SqlProbe.output_base_dir)
        events
      ensure
        ActiveSupport::Notifications.unsubscribe(subscription_name)
      end
    end
  end
end
