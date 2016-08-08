var express = require('express');
var router = express.Router();
var db = require('../database');
var logger = require('../logger');
var uuid = require('node-uuid');

// AUTHENTICATION - All routes here require authentication as admin
router.use(function (req, res, next) {
	// TODO
	console.log('XXX ADMIN Time:', Date.now());
	next();
});

// GET - list of accounts
router.get('/', function(req, res) {
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

// POST - Create an account
router.post('/', function(req, res) {
	var id = uuid.v4();
	console.log(id);

	// XXX Get entries, name etc
	// XXX Create Database
	
	var connection = db.connect();
	connection.query(
		'INSERT INTO account (id,title) VALUES (?,?)', 
		function(err, rows, fields) {
			if (err)
				return res.error(err);
			return res.json({
				success: 1,
				id: id
			});
		}
	);
});

// GET - one account entry
router.get('/:id', function(req, res) {
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

// PUT - update existing entry
router.put('/:id', function(req, res) {
	// Update record
});

module.exports = router;
