// ----------------------------------------------------------------------
$(document).ready(function() {

	// XXX Reloading?

	$('.selectize').selectize();

	// Get specific ID or 'default' (default is captured from last session)
	var id = $.url(window.location.href).param('id');
	var dbid = $.url(window.location.href).param('dbid');
	if (!id || !dbid) {
		alert("No ID provided. Find your URL from your account list");
		return;
	}

	$.get( "/api/account/" + id + "/database/" + dbid, function( data ) {
		console.log(data);
		$('#dashboard-status').text(data.data.status);
		$('#dashboard-options').text(data.data.options);
		$('#dashboard-message').text(data.data.message);
	});

});
