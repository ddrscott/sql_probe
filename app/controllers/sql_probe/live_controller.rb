module SqlProbe
  class LiveController < SqlProbe::ApplicationController
    include Tubesock::Hijack

    def index
      SqlProbe.listening = true
    end

    def feed
      SqlProbe.listening = true
      hijack do |client|
        subscription = ActiveSupport::Notifications.subscribe('sql_probe.file') do |name, started, finished, unique_id, data|
          client.send_data(YAML.load_file(data[:path]).merge(path: data[:path]).to_json)
        end
        client.instance_variable_set(:@sql_probe_subscription, subscription)

        client.onopen do
          client.send_data 'Connected'
          send_recent_files(client, params[:preload].to_i) if params[:preload]
        end

        client.onclose do
          ActiveSupport::Notifications.unsubscribe(client.instance_variable_get(:@sql_probe_subscription))
        end
      end
    end

    def send_recent_files(client, max)
      recent = SqlProbe.output_files.sort_by { |f| File.mtime(f) }.reverse[0..max]
      recent.each { |f| client.send_data(YAML.load_file(f).to_json) }
    end
  end
end
