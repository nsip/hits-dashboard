var express = require('express');
var router = express.Router();

router.post('/login', function(req, res) {
	var login = req.param('username');
	login = login.replace(/[^\w\s]/gi, '');
	if (! config.auth[login])
			return res.json({ success: 0, error: "invalid login" });
	if ( config.auth[login].password != req.param('password'))
			return res.json({ success: 0, error: "invalid password" });
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
