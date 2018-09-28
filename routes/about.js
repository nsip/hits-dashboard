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
var hits_data = require('../hits.json');

// AUTHENTICATION - All entries start with base URL
router.use(function (req, res, next) {
  next();
});

router.get('/version', function(req, res, next) {
    return res.json({
      success: true,

      // New public hits information
      //    TODO - filter for visible
      hits: hits_data,

      // Real entry from package.json
      hits_dashboard: pkginfo.version,
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
          return res.json({
              hits_dashboard: pkginfo.version,
              hits: hits_data,
              text: {
                  dashboardText: dashboardText,
              },
              success: true
            });
          }
    });
});

module.exports = router;
