module SqlProbe
  class ApplicationController < ActionController::Base
    layout 'sql_probe/sql_probe'

    protect_from_forgery with: :exception
  end
end
