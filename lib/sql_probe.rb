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

  def self.listen_token_path
    File.join("#{output_base_dir}", '.listening')
  end

  def self.listening?
    File.file?(listen_token_path)
  end

  def self.listening=(is_listening)
    if is_listening
      FileUtils.mkdir_p(output_base_dir)
      File.open(listen_token_path, 'w'){|f| f << Time.zone.now.to_s}
    else
      FileUtils.rm_rf(listen_token_path)
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
