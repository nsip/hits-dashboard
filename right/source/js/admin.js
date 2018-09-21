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
						{ "title": "Recent", "width": "20%", "data": "recent" , 
                          "defaultContent": '',
                          "render": function (data, type, row, meta) {
                              if(!data || data == '') return "";
                              
                              return '<span style="display: none">' + moment(data).format("YYYY/MM/DD HH:mm:ss") + '</span><span>' + moment(data).format("DD/MM/YYYY HH:mm:ss") + '</span>';
                          }},
                          { "title": "Deactivated", "width": "20%", "data": "deactivated_at" , 
                          "defaultContent": '',
                          "render": function (data, type, row, meta) {
                              if(!data || data == '') return "";
                              
                              return '<span style="display: none">' + moment(data).format("YYYY/MM/DD HH:mm:ss") + '</span><span>' + moment(data).format("DD/MM/YYYY HH:mm:ss") + '</span>';
                          }}
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
							    return '<a href="contact_details.html?contact_id=' + data + '">' + data + '</a>';
							},
							"defaultContent": '',
						},
						{ "title": "Created", "width": "20%", "data": "created_at", "defaultContent": '', 
						    "render": function (data, type, row, meta) {
                                return '<span style="display: none">' + moment(data).format("YYYY/MM/DD HH:mm:ss") + '</span><span>' + moment(data).format("DD/MM/YYYY HH:mm:ss") + '</span>';
						    }
                        },
						{ "title": "Name", "width": "20%", "data": "data", defaultContent: "None", "defaultContent": '',
                            "render": function (data, type, row, meta) {
                                var rows = [];
                                var raw;
                                try {
                                    var raw = JSON.parse(data);
                                }
                                catch(e) {
                                    return data;
                                }
                                return raw['name'];
                            },
                        },
                        { "title": "Email", "width": "20%", "data": "data", defaultContent: "None", "defaultContent": '',
                            "render": function (data, type, row, meta) {
                                var rows = [];
                                var raw;
                                try {
                                    var raw = JSON.parse(data);
                                }
                                catch(e) {
                                    return data;
                                }
                                return raw['email'];
                            },
                        },
						{ "title": "Status", "width": "10%", "data": "status", "defaultContent": '', 
                            "render": function (data, type, row, meta) {
                                var status = data;
                                if(row.account_id){
                                    status = "Existing";
                                }
                                if(status) status = status.charAt(0).toUpperCase() + status.slice(1);
                                
                                return status;
                            }
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