Rails.application.routes.draw do

  mount SqlProbe::Engine => "/sql_probe"
end
