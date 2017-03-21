module SqlProbe
  # Manage an Event File
  class EventsController < ApplicationController
    def show
      @event = YAML.load_file(params[:path])
      # remove duplicates based on exact caller backtraces.
      # add a 'duplicates' count in place of the removed items.
      @event['events'] = @event['events']
        .group_by { |g| g['caller'] }
        .map { |_, items| items.first.tap {|t| t['duplicates'] = items.size }}
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
  end
end
