var express = require('express');
var router = express.Router();

// AUTHENTICATION - All entries start with base URL
router.use(function (req, res, next) {
	// XXX check :accountId and form error
	console.log('Time:', Date.now());
	next();
});

// GET / = Return list of information
router.get('/:accountId/', function(req, res, next) {
	res.send('ROOT respond with a resource = ' + req.params.accountId);
});

// GET /database = Return a list of databases
router.get('/:accountId/database', function(req, res, next) {
	res.send('ROOT respond with a resource = ' + req.params.accountId);
});

// POST /database = Create a database !
router.post('/:accountId/database', function(req, res, next) {
	res.send('ROOT respond with a resource = ' + req.params.accountId);
});

// DELETE /database = Create a database !
//router.post('/:accountId/database', function(req, res, next) {
//});

// Create DB DAta
router.get('/:accountId/database/:dbId/create', function(req, res, next) {
	// http://hits.dev.nsip.edu.au/dbcreate?name=45fb462e-fd78-4e78-9bd3-c7cfeda9e7df&encode=json&type=empty
	res.send('TEST last respond with a resource = ' + req.params.accountId);
});

// GET /database/:id = Return a single database details
router.get('/:accountId/database/:dbId', function(req, res, next) {
	res.send('TEST last respond with a resource = ' + req.params.accountId);
});

module.exports = router;
