var express = require('express');
var router = express.Router();
var db = require('../database');
var logger = require('../logger');
var config = require('config');

var Mailgun = require('mailgun-js');
var mailgun = new Mailgun({apiKey: config.mailgun.apiKey, domain: config.mailgun.domain});

// GET - list of accounts
router.get('/', function(req, res) {
  // XXX req.query.email

  var connection = db.connect();
  connection.query(
    'SELECT * FROM account WHERE email=? AND deleted_at IS NULL',
    [ req.query.email ],
    function(err, rows, fields) {
      if (err)
        return res.error(err);

      console.log(rows);

      if (rows && rows[0] && rows[0].email) {
        var data = {
          from: 'info@nsip.edu.au',
          to: rows[0].email,
          subject: "NSIP Hits Dashboard - recover access url",
          text: "Your HITS Dashboard access URL = " + config.baseurl + "/dashboard/start.html?id=" + rows[0].id,
        };
        mailgun.messages().send(data, function(err, body) {
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
        })
      }

      return res.json({
        success: 1,
      });
    }
  );
});

module.exports = router;
