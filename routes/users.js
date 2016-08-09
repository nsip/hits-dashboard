var express = require('express');
var router = express.Router();

router.post('/login', function(req, res) {
	var login = req.body.username;
	login = login.replace(/[^\w\s]/gi, '');
	console.log(login);
	if (! config.auth[login])
			return res.json({ success: 0, error: "invalid login" });
	if ( config.auth[login].password != req.body.password)
			return res.json({ success: 0, error: "invalid password" });
	console.log("Set session");
	req.session.user = {
			username: login,
			email: config.auth[login].email
	};
	return res.json({ success: 1, user: req.session.user});
});

router.get('/logout', function(req, res) {
	req.session.user = {};
	return res.json({ success: 1 });
});

module.exports = router;
