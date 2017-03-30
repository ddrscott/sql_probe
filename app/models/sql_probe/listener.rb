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
          event.caller = Utils.reject_gem_paths(caller)
          events << event
        end
        begin
          block.call
          EventWriter.write_to_file_system(request: request, events: events, output_base_path: SqlProbe.output_base_dir)
          events
        ensure
          ActiveSupport::Notifications.unsubscribe(subscription_name)
        end
      else
        block.call
      end
    end
  end
end
