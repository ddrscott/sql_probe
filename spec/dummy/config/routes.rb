Rails.application.routes.draw do
  mount SqlProbe::Engine => "/sql_probe"
  resources :homes
  root to: 'homes#index'

  get 'naughty(/:action)', controller: 'naughty'
end
