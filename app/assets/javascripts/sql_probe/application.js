// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require_tree .
//

$(document).ready(function() {
  // add editor div
  var callerCode = $('<div id="caller-code"></div>');
  $('body').append(callerCode);

  // configure editor
  var editor = ace.edit("caller-code");
  editor.getSession().setMode("ace/mode/ruby");
  editor.setReadOnly(true);

  // Override default click behavior to make ajax
  // request to get the source code from the locator
  // and set the value of the editor to the response.
  // Then jump to the line in the response.
  $('.caller-link').on('click', function (e) {
    var $this = $(this);
    e.preventDefault();

    $.ajax({
      url: $this.attr("href"),
      success: function (data) {
        editor.setValue(data.code);
        editor.gotoLine(data.line, 0, true);
      },
      error: function (data) {
        console.error('could not get source. data: ', data);
      }
    });
  })
});
