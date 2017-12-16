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
});
