var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var db = require('../database');
var requestify = require('requestify');
var logger = require('../logger');

// AUTHENTICATION - All entries start with base URL
router.use(function (req, res, next) {
	// XXX check :accountId and form error
	console.log('Time:', Date.now());
	next();
});

// GET / = Return list of information
router.get('/:accountId/', function(req, res, next) {
	res.send('ROOT respond with a resource = ' + req.params.accountId);
	// Especially show status
});

// GET /database = Return a list of databases
router.get('/:accountId/database', function(req, res, next) {
	var connection = db.connect();
	connection.query(
		'SELECT * FROM `database` WHERE account_id = ?',
		[ req.params.accountId ],
		function(err, rows, fields) {
			if (err)
				return res.error(err);
			return res.json({
				success: 1,
				data: rows
			});
		}
	);
});

// POST /database = Create a database !
router.post('/:accountId/database', function(req, res, next) {
	// * Create UUID
	var id = uuid.v4();
	id = id.replace(/-/g,"");
	var name = req.body.name || "no name";
	var type = req.body.type || "empty";

	// * Insert record into database with "status" = "building"

	var connection = db.connect();
	connection.query(
		"INSERT INTO `database` (account_id, id, name, status, options, `when`) VALUES (?,?,?,'building', ?, NOW())",
		[ req.params.accountId, id, name, type ],
		function(err, rows, fields) {
			if (err)
				console.error(err);
				// return res.error(err);

			// XXX
			return;

			// TODO - Build Time for Database
			// TODO - Allow very long times for huge builds

			// * Do GET above in background

			// XXX Change this to check value of return straight away
			requestify.get(
				'http://hits.nsip.edu.au/dbcreate'
				+ '?name=' + id
				+ '&encode=json'
				+ '&type=' + type,
				{
					timeout: 300000	// Long timeout for slow DB Build
				}
			)
			.then(function(response) {
				logger.debug("REMOTE: Response.", response.getBody());
				// XXX
				return;
				// XXX Decode response body and check success
				// Else error
				// * On complete build, update status
				var stat = "unknown";
				var responseData = JSON.parse(response.getBody());
				if (responseData.success)
					stat = "complete";
				connection.query(
					"UPDATE `database` SET status = ? WHERE id = ?",
					[ stat, id ],
					function(err, rows, fields) {
						if (err)
							return logger.error("ERROR: " + err, err);
						logger.info("UPDATE: XXX");
					}
				);
			})
			.fail(function(response) {
				// XXX logger
				connection.query(
					"UPDATE `database` SET status = ? WHERE id = ?",
					[ 'error', id ],
					function(err, rows, fields) {
						if (err)
							return logger.error("ERROR: " + err, err);
						logger.info("UPDATE: XXX");
					}
				);
			});

			// * Return immediate data
			return res.json({
				success: 1,
				id: id,
				status: 'building'
			});
		}
	);
});

// DELETE /database = Create a database !
//router.post('/:accountId/database', function(req, res, next) {
//});

// GET /database/:id = Return a single database details
router.get('/:accountId/database/:dbId', function(req, res, next) {
	res.send('TEST last respond with a resource = ' + req.params.accountId);
});

module.exports = router;
