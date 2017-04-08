module SqlProbe
  module RequestListener
    extend ActiveSupport::Concern

    included do
      around_action :sql_probe_listen
    end

    def sql_probe_event_name
      "#{params[:controller]}##{params[:action]}"
    end

    def sql_probe_listen(&block)
      if SqlProbe.listening?
        Listener.listen(name: sql_probe_event_name, **request.params.symbolize_keys, &block)
      else
        block.call
      end
    end
  end
end
