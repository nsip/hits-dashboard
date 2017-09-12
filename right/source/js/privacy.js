$(document).ready(function() {

  var privacyhide = $.cookie("hits2.privacyhide") || false;
  if (!privacyhide)
    $('#privacy').modal('show');

  $('#privacy-close1').click(function() {
    $.cookie("hits2.privacyhide", true, {expires: 90});
  });

  $('#privacy-close2').click(function() {
    $.cookie("hits2.privacyhide", true, {expires: 90});
  });

});
