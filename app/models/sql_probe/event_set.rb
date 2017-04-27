module SqlProbe
  # Read events from disk
  module EventSet
    module_function

    def all(path: SqlProbe.output_base_dir)
      Dir["#{path}/**/*.yml"]
        .each { |file| puts File.read(file) }
        .map { |file| YAML.load_file(file) || nil } # FIXME sometimes we write empty files :(
        .compact
        .sort_by { |event_group| event_group['start_time'] }
    end

    def files_by_md5(path: SqlProbe.output_base_dir)
      Dir["#{path}/**/*.yml"].each_with_object({}) { |f, agg| agg[Digest::MD5.hexdigest(f)] = f }
    end

    def [](id)
      yaml_cache[id] ||= YAML.load_file(files_by_md5[id])
    end

    def yaml_cache
      @yaml_cache ||= {}
    end
  end
end
