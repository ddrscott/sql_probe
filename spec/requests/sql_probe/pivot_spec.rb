require 'rails_helper'

RSpec.describe 'Pivot', type: :request do
  before(:all) do
    SqlProbe.output_base_dir = File.expand_path(Rails.root.join('..', 'fixtures', 'event_sets'))
  end
  describe 'GET /sql_probe/pivot' do
    let(:expected) do
      [{ 'name' => 'homes#index',
         'path' => "#{SqlProbe.output_base_dir}/1493717786.675837.yml",
         'duration' => 19.50437900086399,
         'mtime' => '2017-05-02T04:40:54.000-05:00',
         'queries' => 2,
         'values' => { 'homes' => 1 } },
       { 'name' => 'homes#index',
         'path' => "#{SqlProbe.output_base_dir}/1493717785.644141.yml",
         'duration' => 266.28787699883105,
         'mtime' => '2017-05-02T04:39:48.000-05:00',
         'queries' => 2,
         'values' => { 'homes' => 1 } }]
    end
    it 'gets data' do
      get '/sql_probe/pivot'
      expect(response).to have_http_status(200), "body: #{response.body}"
      expect(JSON.parse(response.body)).to eq(expected)
    end
  end
end
