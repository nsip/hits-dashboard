// ----------------------------------------------------------------------

$(document).ready(function() {
    $.get('/api/about/changelog', function(getdata) {
      var text = getdata.text;
      $('.readme_output_dashboard').append("<pre>" + text.dashboardText + "</pre>");
      $('.readme_output_data').append("<pre>" + text.dataText + "</pre>");
      $('.readme_output_server').append("<pre>" + text.serverText + "</pre>");
    });
});
