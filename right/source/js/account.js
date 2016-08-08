// ----------------------------------------------------------------------
$(document).ready(function() {

	// XXX Reloading?
	
	var id = $.url(window.location.href).param('id');

	var table = undefined;
	var loadTable = function() {
		if (!table) {
			table = $('#account-databases').DataTable( {
				"ajax": {
					"url": "/account/" + id + "/database",
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
	setTimeout(loadTable, 15000);

	// Create new entry
	$('#create-create').click(function() {
		var name = $('#create-name').val();
		var type = $('#create-type').val();

		$.ajax({
			type: "POST",
			dataType: 'json',
			url: "/account/" + id + "/database",
			data: {
				name: name,
				type: type
			}
		})
		.done(function( data ) {
			loadTable();
		})
		.fail(function() {
			alert("Failed create TODO");
		});

		return false;
	});

});
