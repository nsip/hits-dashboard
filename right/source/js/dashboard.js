// ----------------------------------------------------------------------
$(document).ready(function() {

  // XXX Reloading?

  $('.selectize').selectize();

  // Get specific ID or 'default' (default is captured from last session)
  var id = $.url(window.location.href).param('id');
  var dbid = $.url(window.location.href).param('dbid');
  var option = $.url(window.location.href).param('option');
  if (!id || !dbid) {
    id = $.cookie("hits2.id");
    dbid = $.cookie("hits2.dbid");
  }
  if (!option)
    option = $.cookie("hits2.option");
  if (!option)
    option = "hits";

  if (!id) {
    alert("No ID provided. Find your URL from your account list, or create a new entry.");
    window.location = "recover.html";
    return;
  }
  if (!dbid || (dbid == 'undefined')) {
    alert("No database selected or created. Please select or create a database at the next page.");
    window.location = "account.html";
    return;
  }

  // Set ID in cookie - expires in 90 days
  $.cookie("hits2.id", id, {expires: 90});
  $.cookie("hits2.dbid", dbid, {expires: 90});
  $.cookie("hits2.option", option, {expires: 90});

  var tls = $('#tls-view');
  if (tls) {
    var x = location.protocol;
    var current = location.href.replace(/https?:\/\//i, "")
    if (x == 'https:') {
      tls.html("Switch to HTTP");
      tls.click(function() {
        window.location = 'http://' + current;
      });
    }
    else {
      tls.html("Switch to TLS");
      tls.click(function() {
        window.location = 'https://' + current;
      });
    }
  }

  $.get( "/api/account/" + id + "/database/" + dbid, function( data ) {
    if (!data) {
      $('#dashboard-statusbutton').text("No database exists");
      $('#dashboard-statusbutton').addClass('btn-danger');
      $('#dashboard-statusalert').text("No database exists");
      $('#dashboard-statusalert').addClass('alert-danger');
        return;
    }
    console.log(data);
    $('#dashboard-status').text(data.data.status);
    if (data.data.status == 'complete') {
      $('#dashboard-statusbutton').text(data.data.name + " - Complete");
      $('#dashboard-statusbutton').addClass('btn-success');
      $('#dashboard-statusalert').text(data.data.name + " - Complete");
      $('#dashboard-statusalert').addClass('alert-success');
    }
    else {
      $('#dashboard-statusbutton').text(data.data.name + " - " + data.data.status);
      $('#dashboard-statusbutton').addClass('btn-danger');
      $('#dashboard-statusalert').text(data.data.name + " - " + data.data.status);
      $('#dashboard-statusalert').addClass('alert-danger');
    }
    $('#dashboard-sessiontoken').text(data.data.session);
    if (data.data.environment)
      $('#dashboard-environment').text("http://hits.nsip.edu.au/SIF3InfraREST/hits/environments/" + data.data.environment);
    else
      $('#dashboard-environment').text("(not available)");
    $('#dashboard-applicationkey').text(dbid);
    $('#dashboard-usertoken').text(dbid);
    $('#dashboard-password').text(dbid);
    $('#dashboard-options').text(data.data.options);
    $('#dashboard-message').text((data.data.status == 'complete') ? "(none)" : data.data.message);
    $('#dashboard-client').attr('href', "client.html?id=" + id + "&dbid=" + dbid + "&optoin=" + option); //  + "&user_token=" + dbid + "&password=" + dbid + "");
    $('#dashboard-authmethod').text(data.data.auth_method);

    $('#debug-optiondata').text(data.data.optiondata);
    $('#debug-log').text(data.data.message);
  });

  var viewtable = null;
  $.get( "/api/database/" + dbid + '/tables', function( data ) {
        if (!data) {
          $('#dashboard-statusbutton').text("No database exists");
          $('#dashboard-statusbutton').addClass('btn-danger');
          $('#dashboard-statusalert').text("No database exists");
          $('#dashboard-statusalert').addClass('alert-danger');
            return;
        }
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
                            defaultContent: '',
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

  // Adds an onclick function to delete the database
  $('button.deletedatabase').click(function(){
      var result = confirm("Are you sure you want to delete this database?");
      
      // if yes, then delete the database
      if(result){
          
          $.ajax({
                url: "/api/account/" + id + '/database/' + dbid,
                type: 'DELETE',
                success: function(result) {
                    try {
                        
                        if(!result.success) {
                            alert("There was a problem deleting your database.");
                        } else {
                            window.location.href = 'account.html?id=' + id;
                        }
                        
                    } catch(e) {
                          alert("There was a problem deleting your database: " + e);
                    }
                }
            });
      }
  });
  
  
});
