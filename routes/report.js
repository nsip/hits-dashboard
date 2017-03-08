var express = require('express');
var router = express.Router();
var db = require('../database');
var logger = require('../logger');
var spawn = require('child_process').spawn;

// AUTHENTICATION - All entries start with base URL
router.use(function (req, res, next) {
  next();
});

router.get('/:dbid/report/:reportid', function(req, res, next) {
  var alldata = "";
  // XXX JSON ?

  // Perl version - system("export PERL5LIB=$d/lib/; perl $d/bin/report $id $d/$report > /tmp/$$.pl 2> /tmp/$$.err");
  // report_dir: '/Users/scottp/nsip/HITS-Reports'
  prc = spawn('/usr/sbin/wpa_cli', ['-i','wlan0','scan_results']);

  prc.on('error', function(err) {
    logger.debug("SCAN: Error = " + err);
  });

  prc.stdout.on('data', function (data) {
    alldata = alldata + data.toString();
    logger.debug("SCAN: >" + data.toString());
  });

  prc.stderr.on('data', function (data) {
    logger.debug("SCAN: !" + data.toString());
  });

  prc.on('close', function(code) {
    return res.json({
      data: @lines;
    });
  });

});

module.exports = router;
