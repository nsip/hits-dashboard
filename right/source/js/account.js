// ----------------------------------------------------------------------
$(document).ready(function() {

  // XXX Reloading?

  $('.selectize').selectize();

  $('#create-type').on('change', function(a, b) {
    console.log(a, b);
    console.log(a.val());
    console.log($(a).val());
    return;
  });

  $('#create-schools').ionRangeSlider({
    type: "single",
    min: 0,
    max: 5,
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
    max: 500,  // TODO support 2000
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
    max: 25,  // TODO support more?
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
    max: 20,  // Per teacher ?
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
    window.location = "recover.html";
    return;
  }

  $('#create-type').click(function() {
    alert("Selected...");
  });

  var table = undefined;
  var loadTable = function() {
    if (!table) {
      table = $('#account-databases').DataTable( {
        "ajax": {
          "url": "/api/account/" + id + "/database",
          "dataSrc": "data"
        },
        "order": [[ 2, "desc" ]],
        pageLength: 5,
        "lengthMenu": [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
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
  setInterval(loadTable, 15000);  // TODO Maybe push this to 30 seconds?

  // Create new entry
  $('#create-create').click(function() {
    var name = $('#create-name').val();
    var type = $('#create-type').val();

    // XXX Check values - must have valid entries here

    $.ajax({
      type: "POST",
      dataType: 'json',
      url: "/api/account/" + id + "/database",
      data: {
        name: name,
        type: type,
        // XXX Get the rest of the options
        options: {
          schools: 1,
          students: 1,
          teachers: 1,
          classrooms: 1,
          flags: ['X', 'Y'],
        },
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
