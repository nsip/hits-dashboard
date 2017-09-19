$(document).ready(function() {

  var privacyhide = $.cookie("hits2.privacyhide") || false;
  if (!privacyhide)
    $('#privacy').modal('show');

  $('#privacy-close1').click(function() {
    // Do nothing - allow box to close for next time
  });

  $('#privacy-close2').click(function() {
    if ($("#privacy-checkbox").is(':checked')) {
      $.cookie("hits2.privacyhide", true, {expires: 90});
      return true;
    }
    else {
      alert("You must accept the conditions first");
      return false;
    }
  });

});
