source 'https://rubygems.org'

# Declare your gem's dependencies in sql_probe.gemspec.
# Bundler will treat runtime dependencies like base dependencies, and
# development dependencies will be added by default to the :development group.
gemspec

# Declare any dependencies that are still in development here instead of in
# your gemspec. These might include edge Rails or gems from your path or
# Git. Remember to move these dependencies to your gemspec before releasing
# your gem to rubygems.org.

# To use a debugger
# gem 'byebug', group: [:development, :test]

gem 'sqlite3'

group :development, :test do
  gem 'guard', require: false
  gem 'guard-rspec', require: false
  gem 'rspec-rails', '~> 3.5.0'
  gem 'pry'
  gem 'puma', '~> 3.0'
end

