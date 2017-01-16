// ----------------------------------------------------------------------
$(document).ready(function() {

	// XXX Reloading?

	$('.selectize').selectize();

	// Get specific ID or 'default' (default is captured from last session)
	var id = $.url(window.location.href).param('id');
	if (!id) {
		alert("No ID provided. Find your URL from your account list");
		return;
	}

	$.get( "/XXX/id", function( data ) {
		console.log(data);
	});

});
