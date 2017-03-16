module SqlProbe
  class MainController < ApplicationController
    def index
    end

    def start
      if SqlProbe.listening?
        flash[:success] = "Already listening"
      else
        SqlProbe.listening = true
        flash[:success] = "Listening enabled"
      end
      redirect_to :root
    end

    def stop
      if SqlProbe.listening?
        flash[:success] = "Listening disabled"
        SqlProbe.listening = false
      else
        flash[:success] = "Listening already disabled"
      end
      redirect_to :root
    end

    def reset
      SqlProbe.clear_output_dir
      redirect_to :root
    end
  end
end