module SqlProbe
  module RequestListener
    extend ActiveSupport::Concern

    included do
      around_action :sql_probe_listen
    end

    def sql_probe_event_name
      values = params.except(:controller, :action).values
      "#{params[:controller]}##{params[:action]}#{values.any? ? "(#{values.join(', ')})" : ''}"
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
