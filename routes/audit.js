var express = require('express');
var router = express.Router();
var db = require('../database');
var logger = require('../logger');

// AUTHENTICATION - All entries start with base URL
router.use(function (req, res, next) {
	next();
});

/*

| id                | bigint(20)    | NO   | PRI | NULL    | auto_increment |
| requestTime       | datetime      | YES  |     | NULL    |                |
| responseTime      | datetime      | YES  |     | NULL    |                |
| clientIp          | varchar(45)   | YES  |     | NULL    |                |
| url               | varchar(255)  | YES  |     | NULL    |                |
| solutionId        | varchar(255)  | YES  |     | NULL    |                |
| appKey            | varchar(255)  | YES  |     | NULL    |                |
| userToken         | varchar(255)  | YES  |     | NULL    |                |
| context           | varchar(255)  | YES  |     | NULL    |                |
| instanceId        | varchar(45)   | YES  |     | NULL    |                |
| zone              | varchar(255)  | YES  |     | NULL    |                |
| environmentToken  | varchar(255)  | YES  |     | NULL    |                |
| sessionToken      | varchar(255)  | YES  |     | NULL    |                |
| method            | varchar(45)   | YES  |     | NULL    |                |
| queryParameters   | varchar(2000) | YES  |     | NULL    |                |
| requestHeaders    | varchar(2000) | YES  |     | NULL    |                |
| request           | text          | YES  |     | NULL    |                |
| httpStatus        | int(11)       | YES  |     | NULL    |                |
| responseHeaders   | varchar(2000) | YES  |     | NULL    |                |
| response          | text          | YES  |     | NULL    |                |
| requestMediaType  | varchar(255)  | YES  |     | NULL    |                |
| responseMediaType | varchar(255)  | YES  |     | NULL    |                |
+-------------------+---------------+------+-----+---------+----------------+
*/

/*

var she = 'sj';
var t1 = she.has('boob');
var t2 = she.has('boob');
var n1 = t1.has('nipple')
var n2 = t2.has('nipple')
n1.has('stud');
n2.has('stud');
var he = 'sp';
he.has(she);
console.log(she.inspect());
var l = new Lick();
he.apply(l, she);
console.log(she.sound());
he.on('mmmmm', function() {
	console.log("!!!!!");
});

*/

router.get('/:dbid/summary', function(req, res, next) {
	var connection = db.infra();
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

router.get('/:dbid/data/:rowid', function(req, res, next) {
	var connection = db.infra();
	connection.query(
		'SELECT * FROM XMLAudit WHERE id = ?',
		[req.params.rowid],
		function(err, rows, fields) {
			if (err)
				return res.error(err);
			return res.json({
				success: 1,
				data: rows[0],
			});
		}
	);
});

module.exports = router;
