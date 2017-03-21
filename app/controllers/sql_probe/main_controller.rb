module SqlProbe
  # Manage the dashboard
  class MainController < ApplicationController
    def index
      @events = filter_events(StatementList.new.to_a, params_sql_filter)
      @totals = rollup_counts(@events)
      @pivot = pivot_counts(@events, @totals)
               .sort_by { |row| File.mtime(row[:path]) }
               .reverse
    end

    def show
      @event = YAML.load_file(params[:path])
    end

    def start
      if SqlProbe.listening?
        flash[:success] = 'Already listening'
      else
        SqlProbe.listening = true
        flash[:success] = 'Listening enabled'
      end
      redirect_to :back
    end

    def stop
      if SqlProbe.listening?
        flash[:success] = 'Listening disabled'
        SqlProbe.listening = false
      else
        flash[:success] = 'Listening already disabled'
      end
      redirect_to :back
    end

    def reset
      SqlProbe.clear_output_dir
      redirect_to :back
    end

    private

    def params_sql_filter
      params[:sql_filter].try(:split, ',').try(:map, &:to_sym)
    end

    def filter_events(events, sql_filter)
      return events unless sql_filter
      events.select do |event|
        event[:tables].detect do |_, action|
          sql_filter.include?(action)
        end
      end
    end

    # Expands the events row with columns from totals.
    def pivot_counts(events, totals)
      events
        .group_by { |g| [g[:name], g[:path], g[:queries]] }
        .map do |(name, path, queries), events|
          row = {
            name: name,
            path: path,
            'Total Queries' => queries
          }
          totals.each_with_object(row) do |(table, _), agg|
            agg[table] = events.reduce(0) do |acc, elem|
              if elem[:tables][table]
                acc + 1
              else
                acc
              end
            end
          end
        end
    end

    # Count up totals of all events by table name and action type.
    # @return [Hash<String, Hash<String,Integer>>] Table => Action => Count
    def rollup_counts(events)
      # Totals by table and action to Hash['table']['action']=0
      counts = Hash.new do |h, k|
        h[k] = Hash.new do |h2, k2|
          h2[k2] = 0
        end
      end

      events.each do |event|
        event[:tables].each do |table, action|
          counts[table][action] += 1
        end
      end

      counts.sort_by { |k, _| k }
    end
  end
end
