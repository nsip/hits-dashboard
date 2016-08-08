var express = require('express');
var router = express.Router();
var db = require('../database');
var logger = require('../logger');

// AUTHENTICATION - All routes here require authentication as admin
router.use(function (req, res, next) {
	console.log('XXX ADMIN Time:', Date.now());
	next();
});

router.get('/', function(req, res, next) {
	var connection = db.connect();
	connection.query('SELECT * FROM account', function(err, rows, fields) {
		if (err) 
			return res.error(err);
		return res.json({
			success: 1,
			data: rows
		});
	});
});

module.exports = router;
