var express = require('express');
var app     = express();
var router  = express.Router();
var config = require('config');
// var logger = require('../log/log');

module.exports = function () {
	router.get('/', function (req, res) {
		return res.json({ success: 1, user: req.session.user});
	});

	router.post('/', function(req, res) {
		var login = req.param('username');
		login = login.replace(/[^\w\s]/gi, '');

		if (! config.auth[login])
			return res.json({ success: 0, error: "invalid login" });
		if ( config.auth[login].password != req.param('password'))
			return res.json({ success: 0, error: "invalid password" });

		req.session.user = {
			username: login,
			email: config.auth[login].email,
		};
		return res.json({ success: 1, user: req.session.user});
	});

	router.get('/user', function(req, res) {
		// XXX success 0 if not logged in
		return res.json({ success: 1, user: req.session.user});
	});

	router.get('/logout', function(req, res) {
		delete req.session;
		return res.json({ success: 1 });
	});

	return router;
};
