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
			url: "/api/login",
			data: {
				username: $('input[name="username"]').val(),
				password: $('input[name="password"]').val()
			}
		})
		.done(function( data ) {
			if (data && data.success) {
				console.log(data);
				window.location = "admin.html";
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
