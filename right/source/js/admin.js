// ----------------------------------------------------------------------
$(document).ready(function() {
	var table = undefined;
	var loadTable = function() {
		if (!table) {
			table = $('#admin-accounts').DataTable( {
				"ajax": {
					"url": "/admin",
					"dataSrc": "data"
				},
				"order": [[ 0, "desc" ]],
				"columns": [
					{ 
						"title": "ID", 
						"width": "25%", 
						"data": "id",
						"render": function (data, type, row, meta) {
							return '<a href="account.html?id=' + data + '">' + data + '</a>';
						}
					},
					{ "title": "Name", "width": "20%", "data": "name" },
					{ "title": "Email", "width": "20%", "data": "email" },
					{ "title": "Databases", "width": "10%", "data": "count", defaultContent: "None" },
					{ "title": "Recent", "width": "20%", "data": "recent", defaultContent: "None" }
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
	
	loadTable();
	setInterval(loadTable, 10000);

	// Create new entry
	$('#create-create').click(function() {
		var name = $('#create-name').val();
		var email = $('#create-email').val();

		$.ajax({
			type: "POST",
			dataType: 'json',
			url: "/admin/",
			data: {
				name: name,
				email: email
			}
		})
		.done(function( data ) {
			if (!data || !data.success)
				alert("Failed create TODO");
			$('#create-name').val("");
			$('#create-email').val("");
			loadTable();
		})
		.fail(function() {
			alert("Failed create TODO");
		});

		return false;
	});


});
