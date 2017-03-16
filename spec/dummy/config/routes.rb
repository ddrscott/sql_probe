Rails.application.routes.draw do

  resources :homes
  mount SqlProbe::Engine => "/sql_probe"
end
