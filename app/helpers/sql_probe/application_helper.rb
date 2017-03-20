module SqlProbe
  module ApplicationHelper
    def pretty_caller(caller)
      @rails_path ||= Rails.root.to_s
      SqlProbe::Utils
        .reject_gem_paths(caller)
        .map { |m| m.gsub(@rails_path, '.') }
        .join("\n")
    end

    def caller_links(caller)
      @rails_path ||= Rails.root.to_s
      SqlProbe::Utils
        .reject_gem_paths(caller)
        .map { |m| m.gsub(@rails_path, '.') }
        .map { |m| link_to(m, { controller: 'events', action: 'code', locator: m }, class: 'caller-link') }
        .join("<br/>")
        .html_safe
    end
  end
end
