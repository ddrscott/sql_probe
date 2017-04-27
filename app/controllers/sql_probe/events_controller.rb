module SqlProbe
  # Manage an Event File
  class EventsController < SqlProbe::ApplicationController
    def show
      @event = YAML.load_file(params[:path])

      merge_with_index!(@event['events'])

      @timeline_data = build_timeline_data(@event['events'])
    end

    def build_timeline_data(events)
      events.map do |event|
        [event['sql'] || event['class_name'], Time.parse(event['time']).to_f * 1000, Time.parse(event['end']).to_f * 1000]
      end
    end

    def code
      if params[:locator] =~ /(.*):(\d+):/
        file, line = $1, $2
        @code = File.read(file)
        render json: { file: file, line: line, code: @code }
      else
        render text: '`locator` format must be: `.*:\d+):`', status: 400
      end
    end

    def raw
      send_file params[:path], type: 'application/yaml'
    end

    def view
      @data = File.read(params[:path])
    end

    private

    def merge_with_index!(events)
      events.each_with_index do |event, i|
        event['index'] = i
      end
    end
  end
end
