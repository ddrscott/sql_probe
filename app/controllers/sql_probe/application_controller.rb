module SqlProbe
  class ApplicationController < ActionController::Base
    layout 'sql_probe/application'

    protect_from_forgery with: :exception
  end
end
