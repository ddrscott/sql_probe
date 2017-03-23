module SqlProbe
  class ApplicationController < ActionController::Base
    protect_from_forgery with: :exception
    layout 'sql_probe/application'
  end
end
