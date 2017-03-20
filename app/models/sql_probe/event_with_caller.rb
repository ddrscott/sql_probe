module SqlProbe
  # Adds caller attribute to Instrumented Event
  class EventWithCaller < ActiveSupport::Notifications::Event
    attr_accessor :caller
  end
end
