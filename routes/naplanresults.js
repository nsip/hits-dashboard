var express = require('express');
var app     = express();
var router  = express.Router();
var config = require('config');
var crypto = require('crypto');
var moment = require('moment');

var checkAuth = function() {
	var method = 'xyz';
	var userPart = 'ABC';
	const secret = 'abcdefg';

	const hash = crypto
		.createHmac('sha256', secret)
		.update('I love cupcakes')
		.digest('base64');
	console.log(hash);
}

// Authentication !
router.use(function (req, res, next) {
	// TODO
	console.log('XXX Naplan Results Auth');

	if (
		req
		&& req.headers
		&& req.headers.authorization
	) {
		checkAuth();
		console.log("Got a header", req.headers.authorization);
	}
	else {
		return res.status(401).json({
			success: false,
			error: 'Must supply an Authorization header',
		});
	}
	next();
});

router.get('/', function (req, res) {
	return res.json({ success: 1, message: 'TODO'});
});

module.exports = router;
