module SqlProbe
  module ApplicationHelper
    def pretty_caller(caller)
      @rails_path ||= Rails.root.to_s
      SqlProbe::Utils
        .reject_gem_paths(caller)
        .map { |m| m.gsub(@rails_path, '.') }
        .join("\n")
    end
  end
end
