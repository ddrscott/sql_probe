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

    def ghetto_bar(size, *attrs)
      content_tag(:div, "#{'█' * size}&nbsp;#{size}".html_safe, *attrs)
    end

    def live_feed_ws_url
      live_feed_url({}, only_path: false).gsub(/^http/, 'ws')
    end

    # This will get added to the head of every page before any other script
    # tags are loaded.
    # @see ./app/views/layouts/sql_probe/sql_probe.html.erb
    def javascript_global_config
      {
        development: Rails.env.development?,
        liveFeedWsUrl: live_feed_ws_url,
        eventPath: event_path(path: 'PATH')
      }
    end
  end
end
