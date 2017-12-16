// ----------------------------------------------------------------------
$(document).ready(function() {

	if ($('#admin-accounts').length) {

		var table = undefined;
		// XXX How to get on error to redriect to api admin
		var loadTable = function() {
			if (!table) {
				table = $('#admin-accounts').DataTable( {
					"ajax": {
						"url": "/api/admin",
						"dataSrc": "data"
					},
					"order": [[ 0, "desc" ]],
					"columns": [
						{
							"title": "ID",
							"width": "25%",
							"data": "id",
							"render": function (data, type, row, meta) {
								return '<a href="account_details.html?account_id=' + data + '">' + data + '</a>';
							},
							"defaultContent": '',
						},
						{ "title": "Name", "width": "20%", "data": "name", "defaultContent": '', },
						{ "title": "Email", "width": "20%", "data": "email", "defaultContent": '', },
						{ "title": "Databases", "width": "10%", "data": "count", defaultContent: "None", "defaultContent": '', },
						{ "title": "Recent", "width": "20%", "data": "recent", defaultContent: "None", "defaultContent": '', }
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
	}

	if ($('#admin-contacts').length) {

		var table = undefined;
		// XXX How to get on error to redriect to api admin
		var loadTable = function() {
			if (!table) {
				table = $('#admin-contacts').DataTable( {
					"ajax": {
						"url": "/api/admin/contact",	// XXX Overloaded use of URL
						"dataSrc": "data"
					},
					"order": [[ 1, "desc" ]],
					"columns": [
						{
							"title": "ID",
							"width": "25%",
							"data": "id",
							"render": function (data, type, row, meta) {
								// XXX Mark as done etc.
								//	TODO - Copy fields from this into Account Create - allow creation. Automatic ?
								//	TODO - Mark this as wip, or done where required
								return data; // '<a href="start.html?id=' + data + '">' + data + '</a>';
							},
							"defaultContent": '',
						},
						{ "title": "Created", "width": "20%", "data": "created_at", "defaultContent": '', },
						{ "title": "Status", "width": "20%", "data": "status", "defaultContent": '', },
						{ "title": "Data", "width": "50%", "data": "data", defaultContent: "None", "defaultContent": '',
							"render": function (data, type, row, meta) {
								var rows = [];
								var raw;
								try {
									var raw = JSON.parse(data);
								}
								catch(e) {
									return data;
								}
								$.each(raw, function(key) {
									rows.push(key + " = " + raw[key]);
								});
								return rows.join("<br />\n");
							},
						},
						{ "title": "Account?", "width": "20%", "data": "account", "defaultContent": '', },
						// Adding buttons
						{ "title": "Actions", "width": "20%", "data": "id", defaultContent: "None", "defaultContent": '',
							"render": function (data, type, row, meta) {
								return '<button onclick="console.log(' + "'" + data + "'" + ');" class="btn btn-primary">View</button>';
							},
						},
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
	}

	// Create new entry
	$('#create-create').click(function() {
		var name = $('#create-name').val();
		var email = $('#create-email').val();

		$.ajax({
			type: "POST",
			dataType: 'json',
			url: "/api/admin/",
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
