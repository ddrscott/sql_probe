$LOAD_PATH.push File.expand_path('../lib', __FILE__)

# Maintain your gem's version:
require 'sql_probe/version'

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = 'sql_probe'
  s.version     = SqlProbe::VERSION
  s.authors     = ['Scott Pierce']
  s.email       = ['scott.pierce@centro.net']
  s.homepage    = 'https://stash.centro.net/projects/CEN/repos/sql_probe'
  s.summary     = 'Summary of SqlProbe.'
  s.license     = 'MIT'

  s.files = Dir['{app,config,db,lib}/**/*', 'MIT-LICENSE', 'Rakefile', 'README.rdoc']

  s.test_files = Dir['spec/**/*']

  s.add_dependency 'rails', '>= 4.2.7.1'
  s.add_dependency 'tubesock'

  s.add_development_dependency 'rspec-rails'
end
