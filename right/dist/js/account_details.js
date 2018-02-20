// ----------------------------------------------------------------------
var account_id;
$(document).ready(function() {

    account_id = $.url(window.location.href).param('account_id');
    
    $.ajax({
        type: "GET",
        dataType: 'json',
        url: "/api/admin/" + account_id
    })
    .done(function( data ) {
        if (!data || !data.success) {
            alert("Failed load TODO");
        } else {
            $('.accountName').text(data.data.name);
            $('.accountEmail').text(data.data.email);
            
            $('.accountUpdateName').val(data.data.name);
            $('.acountUpdateEmail').val(data.data.email);
        }
    })
    .fail(function() {
        alert("Failed load TODO");
    });
    
    $('.loginAsAccountButton').click(function() {

        window.location.href = "start.html?id=" + account_id;
        
        return false;
    });
    
    $('.emailAccountButton').click(function() {

        alert("Coming Soon");
        return false;
    });
        
    $('.deleteAccountButton').click(function() {

        var r = confirm("Are you sure you want to delete this user?");
        
        if (r == true) {
            $.ajax({
                type: "DELETE",
                dataType: 'json',
                url: "/api/admin/" + account_id
            })
            .done(function( data ) {
                if (!data || !data.success) {
                    alert("Failed delete TODO");
                } else {
                    window.location.href = "admin.html";
                }
            })
            .fail(function() {
                alert("Failed delete TODO");
            });
        }

        return false;
    });
    
    $('.editAccountButton').click(function(){
        
        $('.displayAccountDetails').toggle();
        $('.editAccountDetails').toggle();
        
    });
    
    $('.accountUpdateSubmit').click(function() {

        // Get the name and email
        var name = $('.accountUpdateName').val();
        if(!name || name.trim() == ''){
            alert("Name cannot be empty");
            return;
        }
        
        var email = $('.acountUpdateEmail').val();
        if(!email || email.trim() == ''){
            alert("Email cannot be empty");
            return;
        }
        
        var r = confirm("Are you sure you want to update this user?");
        
        if (r == true) {
            $.ajax({
                type: "PUT",
                dataType: 'json',
                url: "/api/admin/" + account_id,
                data: {
                    name: name,
                    email: email
                }
            })
            .done(function( data ) {
                if (!data || !data.success) {
                    alert("Failed to update");
                } else {
                    console.log(data);
                    
                    $('.displayAccountDetails').toggle();
                    $('.editAccountDetails').toggle();
                    
                    $('.accountName').text(data.name);
                    $('.accountEmail').text(data.email);
                }
            })
            .fail(function() {
                alert("Failed to update");
            });
        }

        return false;
    });
});
