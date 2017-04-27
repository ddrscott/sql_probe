SqlProbe::Engine.routes.draw do
  root to: 'main#index'

  post 'start', to: 'main#start'
  post 'stop', to: 'main#stop'
  post 'reset', to: 'main#reset'

  get 'event', to: 'events#show'
  get 'event/code', to: 'events#code'
  get 'event/raw', to: 'events#raw', as: :download_raw
  get 'event/view', to: 'events#view', as: :view_raw

  get 'live/feed', to: 'live#feed', as: :live_feed
  get 'live', to: 'live#index', as: :live

  get 'event_sets/:id/:event_id/explain(.:format)', to: 'event_sets#explain'
  get 'event_sets/:id/:event_id/execute(.:format)', to: 'event_sets#execute'
  get 'event_sets/:id/:event_id(.:format)', to: 'event_sets#event'
  get 'event_sets/:id(.:format)', to: 'event_sets#show'
  get 'event_sets(.:format)', to: 'event_sets#index'
end
