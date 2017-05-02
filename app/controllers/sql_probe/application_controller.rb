module SqlProbe
  class ApplicationController < ActionController::Base
    layout 'sql_probe/sql_probe'

    # Local app. This isn't needed
    # protect_from_forgery with: :exception
  end
end
