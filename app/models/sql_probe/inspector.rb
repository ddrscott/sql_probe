module SqlProbe
  # Provides inspection helpers to get interesting
  # facts about a SQL statement.
  class Inspector
    def initialize(sql)
      @sql = sql
    end

    def action
      if insert?
        :insert
      elsif update?
        :update
      elsif delete?
        :delete
      else
        :select
      end
    end

    def action_tables
      if insert?
        [insert_table]
      elsif update?
        [update_table]
      elsif delete?
        [delete_table]
      else
        data_sources
      end
    end

    def insert?
      insert_table.present?
    end

    def delete?
      delete_table.present?
    end

    def update?
      update_table.present?
    end

    def select?
      !(insert? || update? || delete?)
    end

    def insert_table
      clean_sql[/\bINSERT\s+INTO\s+(\w+|"[\w ]+")/im, 1]
    end

    def delete_table
      clean_sql[/\bDELETE\s+FROM\s+(\w+|"[\w ]+")/im, 1]
    end

    def update_table
      # ex: update foo, baz set
      clean_sql[/\bUPDATE\s+(.+?)\s+(SET|,)/im, 1]
    end

    def data_sources
      parts = clean_sql.split(/\W+/)
      parts & SqlProbe::Inspector.all_data_sources
    end

    def self.all_data_sources
      @data_sources ||= ActiveRecord::Base.connection.data_sources
    end

    private

    def clean_sql
      @clean_sql ||= SqlProbe::Utils.remove_redundant_sql_quotes(@sql)
    end
  end
end
