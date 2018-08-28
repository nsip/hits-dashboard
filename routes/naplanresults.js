var express = require('express');
var app     = express();
var router  = express.Router();
var config = require('config');
var crypto = require('crypto');
var moment = require('moment');
var fs = require('fs');

// XXX Move to config
var secret = "XYZ";

var fileOrList = function(path, req, res) {
	fs.stat(path, function(err, stats) {

		console.log("Located name", path);

		// Stream File
		if (stats && stats.isFile()) {
			var stream = fs.createReadStream(path, { bufferSize: 64 * 1024 });
			// XXX Set headers etc
			// XXX GZIP compression?
			// XXX If Stream?
			console.log("STREAM", stream);
			stream.pipe(res);
			return;
		}

		// Show directory entries of type - or load from internal file
		else if (stats && stats.isDirectory()) {
			fs.stat(path + "/index", function(err, stats_index) {
				if (stats_index && stats_index.isFile()) {
					var stream = fs.createReadStream(path + "/index", { bufferSize: 64 * 1024 });
					stream.pipe(res);
					return;
				}

				// XXX Open directory and show
				res.status(400).json({
					success: false,
					title: "Not implemented - directory view without index file",
				});
				return;
			});
		}

		else {
			// XXX 404?
			res.status(404).json({
				success: false,
				title: "Not implemented - unknown type",
			});
			return;
		}
	});
	return;
};

// Authentication !
router.use(function (req, res, next) {
	// TODO
	console.log('XXX Naplan Results Auth');

	// XXX HACK localhost !
	/*
		next();
		return;
	*/

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
	return res.json({
		success: 1,
		message: 'Success - you have logged in. See documentation for how to get data',
	});
});

router.get('/:tag', function (req, res) {
	return fileOrList(config.xsp[req.params.tag].path, req, res);
});

// Return list of directories files & from config
router.get('/:tag/*', function (req, res) {
	return fileOrList(config.xsp[req.params.tag].path + "/" + req.params[0], req, res);
});



module.exports = router;
