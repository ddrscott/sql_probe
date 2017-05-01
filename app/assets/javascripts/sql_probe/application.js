//= require jquery-3.2.0
//= require bootstrap-3.3.7

/**
 * Disable debug logging in production.
 */
if (!SqlProbe.development) {
  console.debug = function() {
    // eat it!
  }
}
