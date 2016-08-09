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

// GET - Update docs
router.get('/', function(req, res) {
	
});

module.exports = router;
