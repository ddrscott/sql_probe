//= require jquery-3.2.0
//= require bootstrap-3.3.7
//= require split-1.2.0
//= require ace-1.2.6
//= require mode-ruby
//= require mode-sql
//= require mode-yaml
//= require_tree ./generated

/**
 * Disable debug logging in production.
 */
if (!SqlProbe.development) {
  console.debug = function() {
    // eat it!
  }
}
