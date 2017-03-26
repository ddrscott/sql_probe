module SqlProbe
  # Manage an Event File
  class EventsController < ApplicationController
    def show
      @event = YAML.load_file(params[:path])

      merge_with_index!(@event['events'])

      @timeline_data = build_timeline_data(@event['events'])

      @event['events'] = consolidate_events_by_caller(@event['events'])
    end

    def build_timeline_data(events)
      base = 0.0
      @event['events'].map do |event|
        [event['sql'], base, (base += event['duration'])]
      end
    end
    helper_method :timeline_data

    def code
      if params[:locator] =~ /(.*):(\d+):/
        file, line = $1, $2
        @code = File.read(file)
        render json: { file: file, line: line, code: @code }
      else
        render text: '`locator` format must be: `.*:\d+):`', status: 400
      end
    end

    private

    def merge_with_index!(events)
      events.each_with_index do |event, i|
        event['index'] = i
      end
    end

    # remove duplicates based on exact caller backtraces.
    # add a 'duplicates' count in place of the removed items.
    def consolidate_events_by_caller(events)
      events
        .group_by { |g| g['caller'] }
        .map do |_, items|
        items.first.tap do |t|
          t['count'] = items.size
          t['seconds'] = items.reduce(0) { |acc, elem| acc + elem['duration'] }
          t['avg_seconds'] = t['seconds'] / items.size.to_f
        end
      end
    end
  end
end
