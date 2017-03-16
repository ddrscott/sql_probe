load '/Users/ricardo.fleury/repos/sql_probe/lib/sql_probe/inspector.rb' if Rails.env.development?
module SqlProbe
  class MainController < ApplicationController
    def index
      # @stats = SqlProbe.generate_stats
      @stats = Dir["#{SqlProbe.output_base_dir}/**/*.yml"].map do |path|
        parse_stats_file(path)
      end

      @stats.sort_by!{|s| s[:file_ts]}

      @tables = {}

      @stats.each do |event|
        event[:stats].each do |stat|
          stat[:tables].each do |table|
            @tables[table] ||= 0
            @tables[table] += 1
          end
        end
      end
    end

    def parse_stats_file(path)
      data = YAML.load(File.read(path))

      sql_stats = data['events']
        .map{ |m| parse_sql(m['sql']) }
        .compact

      {
         path: path,
         file_ts: File.mtime(path),
         controller: data['params']['controller'],
         action: data['params']['action'],
         stats: sql_stats
      }
    end

    def parse_sql(sql)
      ins = Inspector.new(sql)
      tables = ins.action_tables
      if tables.any?
        {
          sql_action: ins.action,
          tables: tables
        }
      end
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