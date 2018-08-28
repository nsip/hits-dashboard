var express = require('express');
var app     = express();
var router  = express.Router();
var config = require('config');
var crypto = require('crypto');
var moment = require('moment');

var secret = "XYZ";

// Authentication !
router.use(function (req, res, next) {
	// TODO
	console.log('XXX Naplan Results Auth');

	var auth = req.headers.authorization;
	if (!auth) {
		return res.status(401).json({
			success: false,
			error: 'Must supply an Authorization header',
			debug: {
				original_auth: auth,
			},
		});
	}

	var timestamp = req.headers.timestamp;
	if (!timestamp) {
		return res.status(401).json({
			success: false,
			error: 'Must supply a timestamp header',
			debug: {
				original_auth: auth,
				original_timestamp: timestamp,
			},
		});
	}

	/*
	if (!req.req.headers["x-signature"]) {
		return res.status(401).json({
			success: false,
			error: 'Must supply an x-signature header',
		});
	}
	*/

	// XXX Check timestamp is within a valid range

	var auth_bits = auth.split(" ");
	if (auth_bits.length != 2) {
		return res.status(401).json({
			success: false,
			error: 'Must supply auth type and token',
			debug: {
				original_auth: auth,
				original_timestamp: timestamp,
			},
		});
	}

	if (auth_bits[0] != 'SIF_HMACSHA256') {
		return res.status(401).json({
			success: false,
			error: 'Auth type must be SIF_HMACSHA256',
			debug: {
				original_method: auth_bits[0],
				original_auth: auth,
				original_timestamp: timestamp,
			},
		});
	}

	var decode_token = (new Buffer(auth_bits[1], 'base64')).toString('utf8');
	var token_bits = decode_token.split(":");

	if (token_bits.length != 2) {
		return res.status(401).json({
			success: false,
			error: 'Must supply auth with a user and token',
			debug: {
				token_bits: token_bits,
				original_auth: auth,
				original_timestamp: timestamp,
			},
		});
	}

	const hash = crypto
		.createHmac('sha256', secret)
		// Add the USER (trusted for now) & Timestamp
		.update(token_bits[0] + ":" + timestamp)
		.digest('base64');
	console.log(hash);

	if (token_bits[1] != hash) {
		return res.status(401).json({
			success: false,
			error: 'Token does not match provided',
			debug: {
				provided_user: token_bits[0],
				provided_token: token_bits[1],
				generated_token: hash,
				original_auth: auth,
				original_timestamp: timestamp,
			},
		});
	}

	/*
	return res.status(401).json({
		success: false,
		error: 'Must supply an Authorization header',
	});
	*/
	next();
});

router.get('/', function (req, res) {
	return res.json({ success: 1, message: 'TODO'});
});

module.exports = router;
