$(document).ready(function() {

	if ($('.pages_dashboard').length) {
		var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
		if ($('.ld-widget-main__chart').length) {
			Morris.Line({
				element: $('.ld-widget-main__chart'),
				data: [
					{d: new Date('2015-01-01').getTime(), a: 15, b: 5, c: 75},
					{d: new Date('2015-02-01').getTime(), a: 60, b: 15, c: 90},
					{d: new Date('2015-03-01').getTime(), a: 30, b: 10, c: 80},
					{d: new Date('2015-04-01').getTime(), a: 50, b: 20, c: 90},
					{d: new Date('2015-05-01').getTime(), a: 35, b: 10, c: 95},
					{d: new Date('2015-06-01').getTime(), a: 90, b: 5, c: 15},
					{d: new Date('2015-07-01').getTime(), a: 35, b: 15, c: 50},
					{d: new Date('2015-08-01').getTime(), a: 50, b: 10, c: 100},
					{d: new Date('2015-09-01').getTime(), a: 30, b: 5, c: 75},
					{d: new Date('2015-10-01').getTime(), a: 95, b: 15, c: 30},
					{d: new Date('2015-11-01').getTime(), a: 30, b: 20, c: 45}
				],
				xkey: 'd',
				ykeys: ['a', 'b', 'c'],
				dateFormat: function (x) {
					return new Date(x).toDateString();
				},
				xLabelFormat: function (x) {
					return month[new Date(x).getMonth()];
				},
				labels: ['Inside', 'Air', 'Water'],
				lineColors: ['#ed4949', '#FED42A', '#20c05c', '#1e59d9'],
				pointSize: 0,
				pointStrokeColors: ['#ed4949', '#FED42A', '#20c05c', '#1e59d9'],
				lineWidth: 3,
				resize: true
			});
		}
		if ($('.ld-widget-side__chart').length) {
			Morris.Donut({
				element: $('.ld-widget-side__chart'),
				data: [
					{label: "Average", value: 150},
					{label: "Maximum", value: 290},
					{label: "Minimum", value: 75}
				],
				colors: ['#ed4949', '#FED42A', '#20c05c', '#1e59d9'],
				backgroundColor: '#30363c',
				labelColor: '#88939C',
				resize: true
			});
		}

		$('.selectpicker').selectpicker();
	}
	
	if ($('.readme_output_dashboard').length) {
	    
	  $.ajax({
          type: "GET",
          dataType: 'json',
          url: "/api/about/changelog"
      })
      .done(function( data ) {
    
          if (!data || !data.success) {
              $('div.readme_output_dashboard').text("Unable to load the change log. Please try again later.");
              $('div.readme_output_data').html("Unable to load the change log. Please try again later.");
              $('div.readme_output_server').html("Unable to load the change log. Please try again later.");
          } else {
              $('div.readme_output_dashboard').html(data.text.dashboardText);
              $('div.readme_output_data').html(data.text.dataText);
              $('div.readme_output_server').html(data.text.serverText);
          }
      })
      .fail(function() {
              $('div.readme_output_dashboard').text("Unable to load the change log. Please try again later.");
              $('div.readme_output_data').html("Unable to load the change log. Please try again later.");
              $('div.readme_output_server').html("Unable to load the change log. Please try again later.");
      });
	
	
	}

	if($('.recoverEmailSubmit').length){
	    $('.recoverEmailSubmit').on("click", function() {
	        
	        var email = $('.recoverEmailAddress').val();
	        
	        $.ajax({
	            url: "/api/recover/?email=" + email,
	            type: 'GET',
	            success: function(result) {
	                try {

	                    // reset the recovery email address
	                    $('.recoverEmailAddress').val('');
	                    $('.emailSentSuccessMessage').show();

	                } catch(e) {
	                    alert("There was a problem sending a recovery email: " + e);
	                }
	            }
	        });    
	    }); 
	}

});
