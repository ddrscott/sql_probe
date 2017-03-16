module SqlProbe
  module Listener
    extend ActiveSupport::Concern

    included do
      around_action :sql_probe_listen
    end

    # Opens a listener for SQL notifications to gather event information
    # @return [Array<ActiveSupport::Notifications::Event>]
    def sql_probe_listen(&block)
      events = []
      subscription_name = ActiveSupport::Notifications.subscribe('sql.active_record') do |*args|
        events << ActiveSupport::Notifications::Event.new(*args)
      end
      block.call
      events
    ensure
      ActiveSupport::Notifications.unsubscribe(subscription_name)
    end
  end
end
