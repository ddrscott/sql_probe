SqlProbe::Engine.routes.draw do
  root to: 'main#index'

  post 'start', to: 'main#start'
  post 'stop', to: 'main#stop'
  post 'reset', to: 'main#reset'
end
