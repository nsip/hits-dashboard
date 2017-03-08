var express = require('express');
var router = express.Router();
var db = require('../database');
var logger = require('../logger');

// AUTHENTICATION - All entries start with base URL
router.use(function (req, res, next) {
	next();
});

router.get('/:dbid/report/:reportid', function(req, res, next) {
	var connection = db.get('hits_sif3_infra');
	connection.query(
		'SELECT id,requestTime,responseTime,clientIp, url, solutionId, appKey, userToken, context, instanceId, zone, environmentToken, sessionToken, method, httpStatus, requestMediaType, responseMediaType FROM XMLAudit WHERE appKey = ? ORDER BY requestTime DESC LIMIT 1000',
    [req.params.dbid],
		function(err, rows, fields) {
            var ret = [];
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
