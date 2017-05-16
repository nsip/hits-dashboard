// ----------------------------------------------------------------------
$(document).ready(function() {
  console.log("INFO START");

  var id = $.url(window.location.href).param('id');
  if (!id)
    id = $.cookie("hits2.id");

  var dbid = $.url(window.location.href).param('dbid');
  if ( !dbid)
    dbid = $.cookie("hits2.dbid");

  // Get some data?
  if (id) {
    $.ajax({
      type: "GET",
      dataType: 'json',
      url: "/api/account/" + id,
    })
    .done(function( data ) {
      if (!data || !data.success) {
        console.log("Failed get misc data for id=" + id);
        return;
      }

      $('.hitsinfo-id').html(data.data.id);
      $('.hitsinfo-email').html(data.data.email);
      $('.hitsinfo-name').html(data.data.name);
    })
    .fail(function() {
      console.log("Failed create TODO");
    });
  }

  // Drop down !
  console.log(id);
  console.log($('#hits-dblist').length);
  if (id && $('#hits-dblist').length) {
    console.log("HITS-DBLIST - Get", id);
    $.ajax({
      type: "GET",
      dataType: 'json',
      url: "/api/account/" + id + "/database",
    })
    .done(function( data ) {
      if (!data || !data.success) {
        console.log("Failed get misc data for id=" + id);
        return;
      }
      console.log("HITS-DBLIST - Get", data);

      dblist = $('#hits-dblist');
      dblist.empty();

      data.data.forEach(function(row) {
        console.log("Add option", row.id, row.name);
        dblist.append('<option value="' + row.id + '">' + row.name + '</option>');
        // dblist3.addOption({id: row.id, label: row.name});
        // dblist3.addItem(row.id);
      });

      var dblist2 = dblist.selectize({
        onChange: function(newval) {
          if (newval != dbid) {
            window.location = window.location.pathname + "?id=" + id + "&dbid=" + newval;
          }
          return;
        },
      });
      var dblist3 = dblist2[0].selectize;

      // Existing DB selected
      if (dbid)
        dblist3.setValue(dbid);
    })
    .fail(function() {
      console.log("Failed get DB LIST");
    });
  }
});
