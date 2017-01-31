// ----------------------------------------------------------------------
$(document).ready(function() {

	// XXX Reloading?

	$('.selectize').selectize();


  $('#create-schools').ionRangeSlider({
	  type: "single",
	  min: 0,
	  max: 10,
		from: 1,
	  prefix: "Schools: ",
	  decorate_both: false,
	  onChange: function (data) {
      // tables.draw();
	  }
	});


  $('#create-students').ionRangeSlider({
	  type: "double",
	  grid: true,
	  min: 0,
	  max: 500,	// TODO support 2000
	  from: 100,
	  to: 200,
	  prefix: "Students: ",
	  decorate_both: false,
	  onChange: function (data) {
      // tables.draw();
	  }
	});


  $('#create-teachers').ionRangeSlider({
	  type: "double",
	  grid: false,
	  min: 0,
	  max: 25,	// TODO support more?
	  from: 5,
	  to: 10,
	  prefix: "Teachers: ",
	  decorate_both: false,
	  onChange: function (data) {
      // tables.draw();
	  }
	});

  $('#create-classrooms').ionRangeSlider({
	  type: "double",
	  grid: false,
	  min: 0,
	  max: 20,	// Per teacher ?
	  from: 3,
	  to: 5,
	  prefix: "Classrooms: ",
	  decorate_both: false,
	  onChange: function (data) {
      // tables.draw();
	  }
	});

	// Get specific ID or 'default' (default is captured from last session)
	var id = $.url(window.location.href).param('id');
	if (!id) {
		alert("No ID provided. Find your original URL");
		return;
	}

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
							return '<a href="dashboard.html?id=' + id + '&dbid=' + data + '">' + data + '</a>';
						}
					},
					{ "title": "Name", "width": "25%", "data": "name" },
					{ "title": "When", "width": "25%", "data": "when" },
					{ "title": "Status", "width": "10%", "data": "status" },
					{ "title": "Options", "width": "10%", "data": "options" },
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
