module SqlProbe
  module EventSetWriter
    module_function

    # Helper to write out raw events to an output location
    def write_to_file_system(name:, start_time:, events:, output_base_path:, duration:, params: nil)
      # ignore all Rails introspection noise
      events.reject! { |e| e.payload[:name] == 'SCHEMA' }
      return if events.empty?

      # reformat event to be more "readable"
      events.map! { |e| flatten_event_payload(e) }

      file_id = Time.now.to_f
      output_dir = File.join(output_base_path, name)
      FileUtils.mkdir_p(output_dir)
      full_path = File.join(output_dir, "#{file_id}.yml")

      # write contents
      result = File.open(full_path, 'w') do |file|
        file << {
          'name' => name,
          'start_time' => start_time,
          'duration' => duration,
          'params' => params,
          'events' => events
        }.to_yaml(line_width: -1)
      end
      ActiveSupport::Notifications.instrument 'sql_probe.file', path: full_path
      result
    end

    def flatten_event_payload(event)
      e = event.as_json
      e.merge!(e.delete('payload'))
    end
  end
end
