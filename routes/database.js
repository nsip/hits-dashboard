var express = require('express');
var router = express.Router();
var uuid = require('uuid');
var db = require('../database');
var requestify = require('requestify');
var logger = require('../logger');

// AUTHENTICATION - All entries start with base URL
router.use(function (req, res, next) {
	next();
});

// DB Tables
router.get('/:dbid/tables', function(req, res, next) {
    // XXX sif in front or not...
    var infraconnection = db.infra();
    infraconnection.query(
        'SELECT databaseUrl FROM APPKEY_DB_URL_MAPPER WHERE applicationKey = ?',
        [ req.params.dbid ],
        function(err, dbrows, fields) {
            if (!dbrows || !dbrows[0]) {
                return res.error("not found");
            }

            console.log("DBID Mapped", dbrows[0].databaseUrl);
            var connection = db.get(dbrows[0].databaseUrl)
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
        }
    );
});

// DB Data
router.get('/:dbid/data/:table', function(req, res, next) {
    // XXX sif in front or not...
    var infraconnection = db.infra();
    infraconnection.query(
        'SELECT databaseUrl FROM APPKEY_DB_URL_MAPPER WHERE applicationKey = ?',
        [ req.params.dbid ],
        function(err, dbrows, fields) {
            if (!dbrows || !dbrows[0]) {
                return res.error("not found");
            }

            var connection = db.get(dbrows[0].databaseUrl)
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
        }
    );
});

module.exports = router;
