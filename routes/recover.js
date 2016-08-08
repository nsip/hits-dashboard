var express = require('express');
var router = express.Router();
var db = require('../database');
var logger = require('../logger');

// GET - list of accounts
router.get('/', function(req, res) {
	// XXX req.query.email
	
	connection.query('SELECT * FROM account WHERE email=?', function(err, rows, fields) {
		if (err) 
			return res.error(err);
		return res.json({
			// XXX Email
			success: 1,

		});
	});
});

module.exports = router;
