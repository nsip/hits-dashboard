// ----------------------------------------------------------------------

$(document).ready(function() {

  $('#hdd-report').click(function() {
  	var el = $('#hbr-data');
  	el.mask("Loading...");

  	api.report.read(info.info.appTemplateId, { report: $('#select-report').val()}).done(function(data) {
  		console.log(data);
  		el.empty();
  		el.append("<h1>Report: " + data.title + "</h1>");
  		el.append("<p>" + data.description + "</p>");
  		el.append("<p>SCORE: " + data.score.percent + "%</p>");
  		$.each(data.tests, function(i,e) {
  			el.append("<hr />");
  			el.append("<h2>Test: " + e.id + " - " + e.title + "</h2>");
  			el.append("<p>" + e.description + "</p>");
  			el.append("<h3>Sub tests:</h3>");
  			$.each(e.subtests, function(e_i,e_e) {
  				el.append("<li>" + e.id + "." + e_e.id + " - " + e_e.title + "</li>");
  			});
  			el.append("<h3>Errors:</h3>");
  			if ( e.errors.length > 0 ) {
  				$.each(e.errors, function(e_i,e_e) {
  					el.append("<li>" + e.id + "." + e_e.subtest + " - " + e_e.details + "</li>");
  				});
  			}
  			else {
  				el.append("<p><strong>NO ERRORS</strong></p>");
  			}
  		});
  		el.unmask();
  	});
  });


});
