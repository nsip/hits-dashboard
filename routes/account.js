var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var db = require('../database');
var requestify = require('requestify'); 

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
	res.send('ROOT respond with a resource = ' + req.params.accountId);
});

// POST /database = Create a database !
router.post('/:accountId/database', function(req, res, next) {
	// * Create UUID
	var id = uuid.v4();
	id = id.replace(/-/g,"");
	var name = req.query.name || "no name";
	
	// * Insert record into database with "status" = "building"
	
	var connection = db.connect();
	connection.query(
		"INSERT INTO database (id,name,status) VALUES (?,?,'building')", 
		[ id, name ],
		function(err, rows, fields) {
			if (err)
				return res.error(err);

			// * Do GET above in background
			requestify.get(
				'http://hits.dev.nsip.edu.au/dbcreate'
				+ '?name=' + id 
				+ '&encode=json'
				+ '&type=empty'	// XXX need to define type
			)
			.then(function(response) {
				logger.debug("REMOTE: Response.", response.getBody());
				// XXX Decode response body and check success
				// Else error
				// * On complete build, update status
				connection.query(
					"UPDATE database SET status = ? WHERE id = ?", 
					[ 'XXX', id ],
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
					"UPDATE database SET status = ? WHERE id = ?", 
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
