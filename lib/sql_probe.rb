require 'sql_probe/engine'

module SqlProbe
  # Use like `Rails.root`
  # @return [Pathname]
  def self.output_base_dir
    @output_base_dir ||= Rails.root.join('tmp/sql_probe')
  end

  def self.output_base_dir=(output_path)
    @output_base_dir = output_path
  end

  def self.listening?
    if File.exists?(Rails.root.join('tmp/sql_probe_state.yml'))
      YAML.load_file(Rails.root.join('tmp/sql_probe_state.yml'))['listening']
    else
      false
    end
  end

  def self.listening=(is_listening)
    File.open(Rails.root.join('tmp/sql_probe_state.yml'), 'w') do |f|
      f.puts({'listening' => is_listening}.to_yaml)
    end
  end

  def self.clear_output_dir
    FileUtils.rm_rf(output_base_dir)
  end

  def self.generate_stats
    {

    }
  end
end
