// ----------------------------------------------------------------------
$(document).ready(function() {

	// XXX Reloading?

	$('.selectize').selectize();

	// Get specific ID or 'default' (default is captured from last session)
	var id = $.url(window.location.href).param('id') || 'default';

	var table = undefined;
	var loadTable = function() {
		if (!table) {
			table = $('#account-databases').DataTable( {
				"ajax": {
					"url": "/api/account/" + id + "/database",
					"dataSrc": "data"
				},
				"order": [[ 0, "desc" ]],
				"columns": [
					{
						"title": "ID",
						"width": "25%",
						"data": "id",
						"render": function (data, type, row, meta) {
							return '<a href="dashboard.html?id=' + data + '">' + data + '</a>';
						}
					},
					{ "title": "Name", "width": "25%", "data": "name" },
					{ "title": "When", "width": "25%", "data": "when" },
					{ "title": "Status", "width": "10%", "data": "status" }
					// { "title": "Databases", "width": "10%", "data": "databases", defaultContent: "None" }
					// Adding buttons
				]
			} );

			/*
			$('#filedata tbody').on('click', 'tr', function () {
				var data = table.row( this ).data();
				window.location = "/ui/processed.html?dir=" + data.id;
			});
			*/
		}
		else {
			table.ajax.reload();
		}
	};

	// Load table
	loadTable();
	setInterval(loadTable, 10000);

	// Create new entry
	$('#create-create').click(function() {
		var name = $('#create-name').val();
		var type = $('#create-type').val();

		$.ajax({
			type: "POST",
			dataType: 'json',
			url: "/api/account/" + id + "/database",
			data: {
				name: name,
				type: type
			}
		})
		.done(function( data ) {
			if (!data || !data.success)
				alert("Failed create TODO");

			$('#create-name').val("");
			$('#create-type').val("");
			loadTable();
		})
		.fail(function() {
			alert("Failed create TODO");
		});

		return false;
	});

});
