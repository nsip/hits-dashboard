/*
 *
 *   Login.js
 *
 */

$(document).ready(function() {
	$('.login__submit').on('click', function() {
		$.ajax({
			type: "POST",
			dataType: 'json',
			url: "/login",
			data: {
				username: $('input[name="username"]').val(),
				password: $('input[name="password"]').val()
			}
		})
		.done(function( data ) {
			if (data && data.success) {
				console.log(data);
				// XXX Keep some information
				// keep across a redirect
				// window.location = "/ui/";
				// 	- cookie
				// 	- ?x=y
				// 	$.ajax GET /user - returns current user information
				window.location = "/ui/projects.html"
			}
			else {
				alert("Failed login - " + data.error);
			}
		})
		.fail(function() {
			alert("Failed login code, reload");
		});

		return false;
	});
});
