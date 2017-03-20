module SqlProbe
  # Manage an Event File
  class EventsController < ApplicationController
    def show
      @event = YAML.load_file(params[:path])
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
