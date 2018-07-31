var express = require('express');
var router = express.Router();
var db = require('../database');
var logger = require('../logger');
var uuid = require('node-uuid');
var exec = require('child_process').exec;

// AUTHENTICATION - All routes here require authentication as admin
router.use(function (req, res, next) {
  // TODO
  console.log('XXX ADMIN Time:', Date.now());
  next();
});

// GET - Update SPECS
router.get('/specs', function(req, res) {
  exec(
    __dirname + "/../../web-specs/update.sh",
    { cwd: __dirname + "/../../web-specs"},
    function(error, stdout, stderr) {
      //console.error(`exec error: ${error}`);
      //console.log(`stdout: ${stdout}`);
      //console.log(`stderr: ${stderr}`);
      res.type("text/plain");
      res.send(""
        + "success: " + (error ? false : true) + "\n"
        + stdout
        + stderr
        + error
      );
    });
});

// GET - Update SPECS
router.get('/usecases', function(req, res) {
  exec(
    __dirname + "/../../usecases/build.sh",
    { cwd: __dirname + "/../../usecases"},
    function (error, stdout, stderr){
      //console.error(`exec error: ${error}`);
      //console.log(`stdout: ${stdout}`);
      //console.log(`stderr: ${stderr}`);
      res.type("text/plain");
      res.send(""
        + "success: " + (error ? false : true) + "\n"
        + stdout
        + stderr
        + error
      );
    });
});

// GET - Update JADE
router.get('/jade', function(req, res) {
  exec(
    __dirname + "/../bin/update_jade.sh",
    { cwd: __dirname + "/.."},
    function (error, stdout, stderr){
      //console.error(`exec error: ${error}`);
      //console.log(`stdout: ${stdout}`);
      //console.log(`stderr: ${stderr}`);
      res.type("text/plain");
      res.send(""
        + "success: " + (error ? false : true) + "\n"
        + stdout
        + stderr
        + error
      );
    });
});

module.exports = router;
