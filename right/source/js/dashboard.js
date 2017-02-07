// ----------------------------------------------------------------------
$(document).ready(function() {

  // XXX Reloading?

  $('.selectize').selectize();

  // Get specific ID or 'default' (default is captured from last session)
  var id = $.url(window.location.href).param('id');
  var dbid = $.url(window.location.href).param('dbid');
  if (!id || !dbid) {
    alert("No ID provided. Find your URL from your account list");
    window.location = "recover.html";
    return;
  }

  $.get( "/api/account/" + id + "/database/" + dbid, function( data ) {
  console.log(data);
  $('#dashboard-status').text(data.data.status);
    if (data.data.status == 'complete') {
      $('#dashboard-statusbutton').text("Complete");
      $('#dashboard-statusbutton').addClass('btn-success');
      $('#dashboard-statusalert').text("Complete");
      $('#dashboard-statusalert').addClass('alert-success');
    }
    else {
      $('#dashboard-statusbutton').text(data.data.status);
      $('#dashboard-statusbutton').addClass('btn-danger');
      $('#dashboard-statusalert').text(data.data.status);
      $('#dashboard-statusalert').addClass('alert-danger');
    }
    $('#dashboard-sessiontoken').text(data.data.session);
    $('#dashboard-applicationkey').text(dbid);
    $('#dashboard-usertoken').text(dbid);
    $('#dashboard-password').text(dbid);
    $('#dashboard-options').text(data.data.options);
    $('#dashboard-message').text((data.data.status == 'complete') ? "(none)" : data.data.message);
    $('#dashboard-client').attr('href', "client.html?application_key=" + dbid + "&user_token=" + dbid + "&password=" + dbid + "");
  });

  var viewtable = null;
  $.get( "/api/database/" + dbid + '/tables', function( data ) {
        console.log(data);
        data.data.forEach(function(row) {
            $('#database-tables').append($('<option>', {value:row, text:row}));
        });
        $('#database-tables').change(function() {
            var table = $("#database-tables option:selected" ).text();

            if (viewtable) {
              viewtable.destroy();
              $('#database-view').empty();
              $('#database-view').append('<div class="alert alert-info">Loading</div>');
              viewtable = null;
            }

            $.get( "/api/database/" + dbid + '/data/' + table, function( data ) {
                try {
                    if (!data || !data.data || !data.data.length) {
                      $('#database-view').empty();
                      $('#database-view').append('<div class="alert alert-danger">No data for this table</div>');
                      return;
                    }

                    var cols = [];
                    Object.keys(data.data[0]).forEach(function(key) {
                        cols.push({
                            title: key,
                            data: key,
                        });
                    });

                    console.log(cols, data.data);

                    $('#database-view').empty();
                    viewtable = $('#database-view').DataTable( {
                        "data": data.data,
                        // "order": [[ 0, "desc" ]],
                        "columns": cols,
                    });
                }
                catch(e) {
                      $('#database-view').empty();
                      $('#database-view').append('<div class="alert alert-danger">ERROR: ' + e + '</div>');
                      return;
                }
            });
        });
    });
});
