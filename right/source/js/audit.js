// ----------------------------------------------------------------------

hljs.initHighlightingOnLoad();

function auditOne(dbid, id) {
  console.log("auditOne: " + id);

  // Loading box...
  $('#audit-one').modal('show');

  console.log("Getting", '/api/audit/' + dbid + '/data/' + id);
  $.get('/api/audit/' + dbid + '/data/' + id, function(data) {
    console.log("Updating", data);

    $('#audit-field-requestHeaders').text(data.data.requestHeaders)
    $('#audit-field-request').text(data.data.request)
    $('#audit-field-responseHeaders').text(data.data.responseHeaders)
    $('#audit-field-response').text(data.data.response)
    $('#audit-field-xmlcmd').text(data.xmlcmd)
    $('#audit-field-xmlout').text(data.xmlout)
    $('#audit-field-xmlerr').text(data.xmlerr)

    $(document).find('pre code').each(function(i, block) {
      console.log("Highlighting block");
      hljs.highlightBlock(block);
    });
  });
}

$(document).ready(function() {

  $('.selectize').selectize();

  // Get specific ID or 'default' (default is captured from last session)
  var id = $.url(window.location.href).param('id');
  var dbid = $.url(window.location.href).param('dbid');
  if (!id || !dbid) {
    id = $.cookie("hits2.id");
    dbid = $.cookie("hits2.dbid");
  }

  if (!id || !dbid) {
    return;
  }

  // XXX Popup !

      table = $('#audit-view').DataTable( {
          "ajax": {
                  "url": "/api/audit/" + dbid + "/summary",
                  "dataSrc": "data"
          },
          "order": [[ 0, "desc" ]],
          "columns": [
                // sessionToken, method, httpStatus, requestMediaType, responseMediaType
                  {
                          "title": "ID",
                          "width": "5%",
                          "data": "id",
                          "render": function (data, type, row, meta) {
                                  // return '<a href="start.html?id=' + data + '">' + data + '</a>';
                                  return '<a onclick="auditOne(\'' + dbid + '\',' + data + ');" href="#">' + data + '</a>';
                          },
                          "defaultContent": '',
                  },
                  { "title": "Time", "width": "10%", "data": "requestTime", defaultContent: "None" },
                  { "title": "IP", "width": "10%", "data": "clientIp", defaultContent: "None" },
                  { "title": "Method", "width": "10%", "data": "method", defaultContent: "None" },
                  { "title": "Status", "width": "10%", "data": "httpStatus", defaultContent: "None" },
                  { "title": "URL", "width": "40%", "data": "url", defaultContent: "None" },
          ]
  } );

  setInterval( function () {
      table.ajax.reload();
  }, 60000 );

});
