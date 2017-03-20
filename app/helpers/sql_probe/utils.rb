module SqlProbe
  module Utils
    module_function

    def reject_gem_paths(caller)
      caller.reject{|r| Gem.default_path.detect{|d| r.include?(d)} }
    end

    def pretty_sql(sql)
      remove_redundant_sql_quotes(sql)
        .gsub(/\s+(SELECT|FROM|WHERE|GROUP|HAVING|LEFT JOIN|LEFT OUTER JOIN|INNER JOIN|JOIN|RIGHT|ORDER|WINDOW|AND|OR)\b/, "\n\\1")
    end

    def remove_redundant_sql_quotes(sql)
      sql.gsub(/(")([\S]+?)\1/, '\2')
    end
  end
end
