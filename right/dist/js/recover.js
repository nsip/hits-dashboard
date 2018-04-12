$(document).ready(function() {
    
    if($('.recoverEmailSubmit').length){
        $('.recoverEmailSubmit').on("click", function() {
            
            var email = $('.recoverEmailAddress').val();
            
            $.ajax({
                url: "/api/recover/?email=" + email,
                type: 'GET',
                success: function(result) {
                    try {

                        // reset the recovery email address
                        $('.recoverEmailAddress').val('');
                        $('.emailSentSuccessMessage').show();

                    } catch(e) {
                        alert("There was a problem sending a recovery email: " + e);
                    }
                }
            });    
        }); 
    }

});