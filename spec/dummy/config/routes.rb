Rails.application.routes.draw do
  mount SqlProbe::Engine => "/sql_probe"
  resources :homes
end
