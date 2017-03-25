class ApplicationController < ActionController::Base
  layout 'sql_probe/sql_probe'
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  include SqlProbe::Listener
end
