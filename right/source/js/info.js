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
  if (id && $('#hits-dblist').length) {
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

      dblist = $('#hits-dblist');
      dblist.empty();

      // Keep a local copy for extra field pass through
      keepbyid = {};
      data.data.forEach(function(row) {
        keepbyid[row.id] = row;
        keepbyid[row.id].opout = "hits";
        if (row.opdata.hmac)
          keepbyid[row.id].opout += ",hmac";
        dblist.append('<option value="' + row.id + '">' + row.name + '</option>');
        // dblist3.addOption({id: row.id, label: row.name});
        // dblist3.addItem(row.id);
      });

      var dblist2 = dblist.selectize({
        onChange: function(newval) {
          if (newval != dbid) {
            window.location = window.location.pathname + "?id=" + id + "&dbid=" + newval + "&option=" + keepbyid[newval].opout;
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
