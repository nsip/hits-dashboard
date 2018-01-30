var express = require('express');
var router = express.Router();
var db = require('../database');
var logger = require('../logger');
var uuid = require('node-uuid');
var config = require('config');
var Mailgun = require('mailgun-js');
var mailgun = new Mailgun({apiKey: config.mailgun.apiKey, domain: config.mailgun.domain});

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

      var maildata = {
        from: 'info@nsip.edu.au',
        to: 'info@nsip.edu.au',
        subject: "NSIP Hits Dashboard - contact notification",
        text: "Contact notification from: " + req.body.email,
      };
      mailgun.messages().send(maildata, function(err, body) {
        //If there is an error, render the error page
        if (err) {
          console.log("EMAIL: error: ", err);
          // res.statu(400).json({success: false, message: "Error - " + err});
        }
        //Else we can greet    and leave
        else {
          console.log("EMAIL: Success: ", body);
          // res.json({success: true, body: body});
        }
      });

      return res.json({
        success: 1,
        id: id
      });
    }
  );
});

router.get('/projectlist', function(req, res) {

  return res.json({
    success: 1,
    project_list: config.project_list
  });

});

module.exports = router;
