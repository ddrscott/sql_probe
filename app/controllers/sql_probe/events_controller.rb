module SqlProbe
  # Manage an Event File
  class EventsController < ApplicationController
    def show
      @event = YAML.load_file(params[:path])
    end
  end
end
