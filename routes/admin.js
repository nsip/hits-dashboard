var express = require('express');
var router = express.Router();

// AUTHENTICATION - All routes here require authentication as admin
router.use(function (req, res, next) {
	console.log('Time:', Date.now());
	next();
});

router.get('/', function(req, res, next) {
	// XXX Check quth
  res.send('respond with a resource');
});

module.exports = router;
