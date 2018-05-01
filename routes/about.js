var config = require('config');
var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var db = require('../database');
var requestify = require('requestify');
var logger = require('../logger');
var async = require('async');
var fs = require('fs');
var pkginfo = require('../pkginfo');

// AUTHENTICATION - All entries start with base URL
router.use(function (req, res, next) {
  // XXX check :accountId and form error
  console.log('Time:', Date.now());
  next();
});

router.get('/version', function(req, res, next) {

    return res.json({
        sif_data: config.project_versions.sif_data,
        hits_dashboard: pkginfo.version,
        sif_server: config.project_versions.sif_server,
        success: true
    });

});

// TODO refactor to async module ? (concurrent parsing)
router.get('/changelog', function(req, res, next) {

    fs.readFile('CHANGELOG.md', (e, data) => {
        if(e){
            return res.json({
                success: false
            });
        } else {

            var dashboardText = data.toString();

            fs.readFile('../sif-data/CHANGELOG.md', (e, data) => {
                if(e){
                    return res.json({
                        success: false
                    });
                } else {

                    var dataText = data.toString();

                    // XXX SIF Server Changelog location
                    fs.readFile('config/changelog_sif_server.md', (e, data) => {
                        if(e){
                            return res.json({
                                success: false
                            });
                        } else {

                            var serverText = data.toString();

                            return res.json({
                                text: {
                                    dashboardText: dashboardText,
                                    dataText: dataText,
                                    serverText: serverText
                                },
                                success: true
                            });
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;
