$(document).ready(function() {

  var privacyhide = $.cookie("hits2.privacyhide") || false;
  var versionhide = $.cookie("hits2.versionhide") || false;
  
  if (!privacyhide || !versionhide) {
    $("#privacy-checkbox").prop('checked', privacyhide);
    $("#version-checkbox").prop('checked', versionhide);
    $('#privacy').modal('show');
    }
  $('#privacy-close1').click(function() {
    // Do nothing - allow box to close for next time
  });

  $('#privacy-close2').click(function() {
    var valid = true;
    
    if ($("#privacy-checkbox").is(':checked')) {
      $.cookie("hits2.privacyhide", true, {expires: 90});  
    }
    else {
     valid = false;
    }
    
    if ($("#version-checkbox").is(':checked')) {
      $.cookie("hits2.versionhide", true, {expires: 90});
    }
    else {
        valid = false;
     }
         
    if (valid) {
        return true;
    }
    else {    
      alert("You must accept the conditions first");
      return false;
    }
  });

});
