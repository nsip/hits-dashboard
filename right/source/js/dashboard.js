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
		$('#dashboard-applicationkey').text(dbid);
		$('#dashboard-usertoken').text(dbid);
		$('#dashboard-password').text(dbid);
		$('#dashboard-options').text(data.data.options);
		$('#dashboard-message').text((data.data.status == 'complete') ? "(none)" : data.data.message);
		$('#dashboard-client').attr('href', "/client/Simple/?application_key=" + dbid + "&user_token=" + dbid + "&password=" + dbid + "");
	});

    var viewtable;
	$.get( "/api/database/" + dbid + '/tables', function( data ) {
        console.log(data);
        data.data.forEach(function(row) {
            $('#database-tables').append($('<option>', {value:row, text:row}));
        });
        $('#database-tables').change(function() {
            var table = $("#database-tables option:selected" ).text();
            $.get( "/api/database/" + dbid + '/data/' + table, function( data ) {
                try {
                    if (!data || !data.data || !data.data.length)
                        return;

                    var cols = [];
                    Object.keys(data.data[0]).forEach(function(key) {
                        cols.push({
                            title: key,
                            data: key,
                        });
                    });

                    console.log(cols, data.data);

                    if (viewtable)
                        viewtable.destroy();

                    viewtable = $('#database-view').DataTable( {
                        "data": data.data,
                        // "order": [[ 0, "desc" ]],
                        "columns": cols,
                    });
                }
                catch(e) {
                    alert(e);
                }
            });
        });
    });
});
