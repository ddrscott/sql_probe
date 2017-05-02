require 'rails_helper'

RSpec.describe 'Listen', type: :request do
  describe 'GET /sql_probe/listen/*' do
    it 'starts listening' do
      post '/sql_probe/listen/start'
      expect(response).to have_http_status(200)
    end
    it 'stops listening' do
      post '/sql_probe/listen/stop'
      expect(response).to have_http_status(200)
    end

    it 'resets data' do
      post '/sql_probe/listen/reset'
      expect(response).to have_http_status(200)
    end
  end
end
