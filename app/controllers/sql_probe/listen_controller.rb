module SqlProbe
  # APIs to manage listening of Rails instrumentation
  class ListenController < SqlProbe::ApplicationController
    def start
      if SqlProbe.listening?
        render json: { state: 'Already listening' }
      else
        SqlProbe.listening = true
        render json: { state: 'Listening enabled' }
      end
    end

    def stop
      if SqlProbe.listening?
        render json: { state: 'Listening disabled' }
        SqlProbe.listening = false
      else
        render json: { state: 'Listening already disabled' }
      end
    end

    def reset
      SqlProbe.clear_output_dir
      render json: { state: 'Data removed' }
    end
  end
end
