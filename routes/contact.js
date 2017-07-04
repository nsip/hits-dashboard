var express = require('express');
var router = express.Router();
var db = require('../database');
var logger = require('../logger');
var uuid = require('node-uuid');

// GET data - maybe move to ADMIN !
/*
router.get('/', function(req, res) {
  var connection = db.connect();
  connection.query('SELECT * FROM contact', function(err, rows, fields) {
    if (err)
      return res.error(err);
    return res.json({
      success: 1,
      data: rows
    });
  });
});
*/

// POST - Send contact details
//  XXX: This is not doing any CAPTCHA !
router.post('/', function(req, res) {
  var id = uuid.v4();

  var data = JSON.stringify(req.body);

  var connection = db.connect();
  connection.query(
    "INSERT INTO contact (id, status, created_at, data) VALUES (?,'waiting', NOW(),?)",
    [ id, data ],
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

module.exports = router;
