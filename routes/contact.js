var express = require('express');
var router = express.Router();
var db = require('../database');
var logger = require('../logger');
var uuid = require('uuid');
var config = require('config');
var Mailgun = require('mailgun-js');
var mailgun = new Mailgun({apiKey: config.mailgun.apiKey, domain: config.mailgun.domain});
var async = require('async');

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

  var developerArchitect = "Neither";
  if(req.body.checkbox_developer && req.body.checkbox_developer == 'on'
      && req.body.checkbox_developer && req.body.checkbox_developer == 'on'){
      developerArchitect = "Developer and Architect";
  } else if(req.body.checkbox_developer && req.body.checkbox_developer == 'on'){
      developerArchitect = "Developer";
  } else if(req.body.checkbox_architect && req.body.checkbox_architect == 'on'){
      developerArchitect = "Architect";
  }

  var representation = "Neither";
  if(req.body.checkbox_school_authority && req.body.checkbox_school_authority == 'on'
      && req.body.checkbox_vendor && req.body.checkbox_vendor == 'on'){
      representation = "Vendor and School Authority";
  } else if(req.body.checkbox_vendor && req.body.checkbox_vendor == 'on'){
      representation = "Vendor";
  } else if(req.body.checkbox_school_authority && req.body.checkbox_school_authority == 'on'){
      representation = "School Authority";
  }

  var familiarSif = "No";
  if(req.body.checkbox_sif && req.body.checkbox_sif == 'on'){
      familiarSif = "Yes";
  }

  var nsipProject = "None";
  if(req.body.nsip_project && req.body.nsip_project.trim() != ''){
      nsipProject = req.body.nsip_project;
  }

  var emailText = "Contact notification from: " + req.body.email
      + "\nName: " + req.body.name
      + "\nOrganisation: " + req.body.organisation
      + "\nInterest: " + req.body.interest
      + "\nI am a (developer/architect): " + developerArchitect
      + "\nI represent (vendor/school authority): " + representation
      + "\nI am familar with SIF: " + familiarSif
      + "\nI am involved in NSIP project: " + nsipProject;


  var connection = db.connect();
  connection.query(
    "INSERT INTO contact (id, status, created_at, data) VALUES (?,'waiting', NOW(),?)",
    [ id, data ],
    function(err, rows, fields) {
      if (err)
        return res.error(err);

      async.mapSeries(
        ["accessrequest@nsip.edu.au", "scott.penrose@nsip.edu.au", "peter.haydon@nsip.edu.au"],
        function(to, step) {
          var maildata = {
            from: 'info@nsip.edu.au',
            to: to, // 'accessrequest@nsip.edu.au', // 'info@nsip.edu.au',
            subject: "NSIP Hits Dashboard - contact notification",
            text: emailText,
          };
          mailgun.messages().send(maildata, function(err, body) {
            if (err) {
              console.log("EMAIL: to=" + to + ", error: ", err);
              step(err);
            }
            else {
              console.log("EMAIL: to=" + to + ", Success: ", body);
                step();
            }
          });
      },
      function(err) {
            //If there is an error, render the error page
            if (err) {
              // res.statu(400).json({success: false, message: "Error - " + err});
              return res.json({
                success: 0,
                message: "Unable to send email",
                error: err + "",
                id: id,
              });
            }
            //Else we can greet    and leave
            else {
              // res.json({success: true, body: body});
              return res.json({
                success: 1,
                message: "Email sent",
                id: id,
              });
            }
      }
    );

  });
});

router.get('/projectlist', function(req, res) {

  return res.json({
    success: 1,
    project_list: config.project_list
  });

});

module.exports = router;
