var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var db = require('../database');
var requestify = require('requestify');
var logger = require('../logger');

// AUTHENTICATION - All entries start with base URL
router.use(function (req, res, next) {
	next();
});

// DB Tables
router.get('/:dbid/tables', function(req, res, next) {
	var connection = db.get(req.params.dbid);
	connection.query(
		'SHOW TABLES;',
		function(err, rows, fields) {
			if (err)
				return res.error(err);
            var ret = [];
						if (rows) {
	            rows.forEach(function(r) {
	                var k = Object.keys(r);
	                ret.push(r[k[0]]);
	            });
						}
						return res.json({
							success: 1,
							data: ret,
						});
		}
	);
});

// DB Data
router.get('/:dbid/data/:table', function(req, res, next) {
	var connection = db.get(req.params.dbid);
	connection.query(
		'SELECT * FROM `' + req.params.table + '` LIMIT 5000',
		function(err, rows, fields) {
			if (err)
				return res.error(err);
			return res.json({
				success: 1,
				data: rows,
			});
		}
	);
});

module.exports = router;
