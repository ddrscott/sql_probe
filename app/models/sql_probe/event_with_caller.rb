module SqlProbe
  # Adds caller attribute to Instrumented Event
  class EventWithCaller < ActiveSupport::Notifications::Event
    attr_reader :caller
    attr_accessor :elapsed

    def initialize(*args)
      super
      # force duration calculation
      self.duration
      # set caller backtrace
      @caller = Utils.reject_gem_paths(Kernel.caller)
                     .reject { |r| r =~ %r{/app/.*/sql_probe/} } # omit ourselves
    end

    def [](key)
      payload[key] || payload[key.to_sym]
    end
  end
end
