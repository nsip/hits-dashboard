var config = require('config');
var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var db = require('../database');
var requestify = require('requestify');
var logger = require('../logger');
var async = require('async');
var fs = require('fs');

// AUTHENTICATION - All entries start with base URL
router.use(function (req, res, next) {
  // XXX check :accountId and form error
  console.log('Time:', Date.now());
  next();
});

router.get('/version', function(req, res, next) {

    return res.json({
        sif_data: config.project_versions.sif_data, 
        hits_dashboard: config.project_versions.hits_dashboard, 
        sif_server: config.project_versions.sif_server,
        success: true
    });

});

router.get('/changelog', function(req, res, next) {

    fs.readFile('config/changelog.md', (e, data) => {
        if(e){
            return res.json({
                success: false
            });
        } else {
            
            var text = data.toString();
            
            // TODO - we might want to process more
            
            return res.json({
                text: text,
                success: true
            });
        }
    });
});

module.exports = router;
