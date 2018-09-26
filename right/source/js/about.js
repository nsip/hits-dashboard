// ----------------------------------------------------------------------

$(document).ready(function() {
    $.get('/api/about/changelog', function(getdata) {
      var text = getdata.text;
      $('.readme_output_dashboard').append("<pre>" + text.dashboardText + "</pre>");

      $('#hits-version').append("<pre>" + getdata.hits.name + " " + getdata.hits.version + "</pre>");
      // $('.readme_output_data').append("<pre>" + text.dataText + "</pre>");
      // $('.readme_output_server').append("<pre>" + text.serverText + "</pre>");

      table = $('#hits-packages').DataTable( {
        ajax: {
          url: "/api/about/changelog",
          dataSrc: "hits.dependencies"
        },
        "bSort": false,
        "paging":   false,
        "ordering": false,
        "info":     false,
        "searching":     false,

        // "order": [[ 2, "desc" ]],
        // pageLength: 10,
        // "lengthMenu": [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
        // TODO - Adding links to versions etc etc
        "columns": [
          {
            "title": "Package",
            "width": "30%",
            "data": "package",
            "defaultContent": '',
          },
          {
            "title": "Version",
            "width": "30%",
            "data": "version",
            "defaultContent": '',
          },
        ],
      });

    });
});
