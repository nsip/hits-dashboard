$(document).ready(function() {

  var privacyhide = $.cookie("hits2.privacyhide") || false;
  var versionhide = $.cookie("hits2.versionhide") || "";

  // XXX version must be the actual version, not true/false

  $.ajax({
      type: "GET",
      dataType: 'json',
      url: "/api/about/version"
  })
  .done(function( data ) {
      if (!data || !data.success) {
          // Don't alert the user, just swallow the error, its not critical
      } else {
            // XXX replace span
            // XXX Check versions match
            
            $("#SIFAUVERSION").html(data.hits.sifau_version);

            if (
                !privacyhide
                || (versionhide !== data.hits.sifau_version)
            ) {
                    $("#privacy-checkbox").prop('checked', privacyhide);
                    $("#version-checkbox").prop('checked', versionhide);
                    $('#privacy').modal('show');

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
                      $.cookie("hits2.versionhide", data.hits.sifau_version, {expires: 90});
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
            }


      }
  })
  .fail(function() {
      // swallow the error
  });

  

});
