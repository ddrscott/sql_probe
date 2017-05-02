SqlProbe::Engine.routes.draw do
  root to: 'pivot#index'

  post 'listen/start', to: 'listen#start'
  post 'listen/stop',  to: 'listen#stop'
  post 'listen/reset', to: 'listen#reset'

  get 'pivot', to: 'pivot#index'

  get 'event', to: 'events#show'
  get 'event/code', to: 'events#code'
  get 'event/raw', to: 'events#raw', as: :download_raw
  get 'event/view', to: 'events#view', as: :view_raw

  get 'live/feed', to: 'live#feed', as: :live_feed
  get 'live', to: 'live#index', as: :live
  get 'live/main', to: 'live#main'

  get 'event_sets/:id/:event_id/explain(.:format)', to: 'event_sets#explain'
  get 'event_sets/:id/:event_id/execute(.:format)', to: 'event_sets#execute'
  get 'event_sets/:id/:event_id(.:format)', to: 'event_sets#event'
  get 'event_sets/:id(.:format)', to: 'event_sets#show'
  get 'event_sets(.:format)', to: 'event_sets#index'
end
