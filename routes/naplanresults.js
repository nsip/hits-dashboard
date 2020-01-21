var express = require('express');
var app     = express();
var router  = express.Router();
var config = require('config');
var crypto = require('crypto');
var moment = require('moment');
var fs = require('fs');
var zlib = require('zlib');
var uuid = require('node-uuid');
var logger = require('../logger');

// NOTE: Call this with XML safe inputs
var retError = function(req, res, status, scope, message, description) {

	var id = uuid.v4();

	var xml = ''
		+ '<error id="' + id + '">'
		+ '  <Code>' + status + '</Code>'
		+ '  <Scope>' + scope + '</Scope>'
		+ '  <Message>' + message + '</Message>'
		+ '  <Description>' + description + '</Description>'
		// DEBUG?
		+ '</error>';

	res.set('Content-Type', 'application/xml');
	// Non-standard status header (TODO - what should be in this)
	res.set('Status', status + "");
	res.status(status);
	res.send(xml);
}

var fileOrList = function(path, req, res) {
	fs.stat(path, function(err, stats) {
		console.log("Located name", path);
		logger.info("NAPLAN PATH = " + path);

		var stream;
		var processFile = function() {
			res.set('Content-Type', 'application/xml');
			var accept = req.get('Accept-Encoding') || "";
			if (/gzip/i.test(accept)) {
				res.set('Content-Encoding', 'gzip');
				stream = stream.pipe(zlib.createGzip())
			}
			stream.pipe(res);
			return;
		};

		if (stats && stats.isFile()) {
			stream = fs.createReadStream(path, { bufferSize: 64 * 1024 });
			processFile();
			return;
		}
		else if (stats && stats.isDirectory()) {
                       fs.stat(path + "/index", function(err, stats_index) {
                               if (stats_index && stats_index.isFile()) {
                                       stream = fs.createReadStream(path + "/index", { bufferSize: 64 * 1024 });
					processFile();
				}
				else {
					retError(res, res, 404, 'GET', 'No directory listing', 'No index for this directory');
				}
				return;
			});
		}

		else {
			retError(res, res, 404, 'GET', 'Entry not found', 'This URL or ID does not exist');
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
		logger.info("NAPLAN", {"area": "authentication", "success": false, message: "No auth header"});
		retError(res, res, 401, 'AUTH', 'Must supply an Authorization header', '');
		// debug: { original_auth: auth, },
		return;
	}

	var timestamp = req.headers.timestamp;
	if (!timestamp) {
		logger.info("NAPLAN", {"area": "authentication", "success": false, message: "No timestamp"});
		retError(res, res, 401, 'AUTH', 'Must supply a timestamp header', '');
		return;
		/*
			debug: {
				original_auth: auth,
				original_timestamp: timestamp,
			},
		*/
	}

	// Check format - ISO 8601
	if (! moment(timestamp, moment.ISO_8601).isValid()) {
		logger.info("NAPLAN", {"area": "authentication", "success": false, message: "Timestamp invalid", value: timestamp});
		retError(res, res, 401, 'AUTH', 'Timestamp is not able to be parsed', '');
		return;
			/*
			debug: {
				timestamp: timestamp,
			},
			*/
	}

	// Check it is within the last 5 minutes, and not more than 5 minutes ahead
	var parsedDate = moment(timestamp);
	var nowDate = moment();
	var seconds = nowDate.diff(parsedDate, 'seconds');

	// Old / New
	if (seconds > 300) {
		logger.info("NAPLAN", {"area": "authentication", "success": false, message: "Timestamp too old", value: timestamp});
		retError(res, res, 401, 'AUTH', 'Timestamp is older than 5 minutes', '');
		return;
			/*
			debug: {
				timestamp: timestamp,
				nowDate: nowDate,
				parsedDate: parsedDate,
				seconds: seconds,
			},
			*/
	}

	// Old / New
	if (seconds < -300) {
		logger.info("NAPLAN", {"area": "authentication", "success": false, message: "Timestamp too new", value: timestamp});
		retError(res, res, 401, 'AUTH', 'Timestamp is ahead by more than 5 minutes', '');
		return;
			/*
			debug: {
				timestamp: timestamp,
				nowDate: nowDate,
				parsedDate: parsedDate,
				seconds: seconds,
			},
			*/
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
		logger.info("NAPLAN", {"area": "authentication", "success": false, message: "Missing Type or Token", value: auth});
		retError(res, res, 401, 'AUTH', 'Must supply auth type and token', '');
		return;
			/*
			debug: {
				original_auth: auth,
				original_timestamp: timestamp,
			},
			*/
	}

	if (auth_bits[0] != 'SIF_HMACSHA256') {
		logger.info("NAPLAN", {"area": "authentication", "success": false, message: "Header must be SIF_HMACSHA256", value: auth});
		retError(res, res, 401, 'AUTH', 'Auth type must be SIF_HMACSHA256', '');
		return;
			/*
			debug: {
				original_method: auth_bits[0],
				original_auth: auth,
				original_timestamp: timestamp,
			},
			*/
	}

	var decode_token = (new Buffer(auth_bits[1], 'base64')).toString('utf8');
	var token_bits = decode_token.split(":");

	if (token_bits.length != 2) {
		logger.info("NAPLAN", {"area": "authentication", "success": false, message: "Missing user or token", value: [auth, decoded_token]});
		retError(res, res, 401, 'AUTH', 'Must supply auth with a user and token', '');
		return;
			/*
			debug: {
				token_bits: token_bits,
				original_auth: auth,
				original_timestamp: timestamp,
			},
			*/
	}

	var user = token_bits[0];
	var secret = config.naplanresults.users[user] || "CanNeverMatchEverEverEver";

	const hash = crypto
		.createHmac('sha256', secret)
		// Add the USER (trusted for now) & Timestamp
		.update(user + ":" + timestamp)
		.digest('base64');
	console.log(hash);

	if (token_bits[1] != hash) {
		logger.info("NAPLAN", {"area": "authentication", "success": false, message: "Token does not match", value: [auth, decoded_token]});
		retError(res, res, 401, 'AUTH', 'Token does not match provider', '');
		return;
			/*
			debug: {
				provided_user: token_bits[0],
				provided_token: token_bits[1],
				generated_token: hash,
				original_auth: auth,
				original_timestamp: timestamp,
			},
			*/
	}

	/*
	return res.status(401).json({
		success: false,
		error: 'Must supply an Authorization header',
	});
	*/
	logger.info("NAPLAN", {"area": "authentication", "success": true, message: "User Logged In", value: user});
	next();
});

router.get('/', function (req, res) {
	logger.info("NAPLAN", {"area": "get root", "success": true, message: "", value: null});
	return res.json({
		success: 1,
		message: 'Success - you have logged in. See documentation for how to get data',
	});
});

router.get('/:tag', function (req, res) {
	logger.info("NAPLAN", {"area": "get tag", "success": true, message: "", value: req.params.tag});
	return fileOrList(config.xsp[req.params.tag].path, req, res);
});

// Return list of directories files & from config
router.get('/:tag/*', function (req, res) {
	logger.info("NAPLAN", {"area": "get directory", "success": true, message: "", value: req.params.tag});
	return fileOrList(config.xsp[req.params.tag].path + "/" + req.params[0], req, res);
});

module.exports = router;
