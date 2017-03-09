var express = require('express');
var router = express.Router();
var db = require('../database');
var logger = require('../logger');
var spawn = require('child_process').spawn;
const os = require('os');

// AUTHENTICATION - All entries start with base URL
router.use(function (req, res, next) {
  next();
});

router.get('/:dbid/report/:reportid', function(req, res, next) {
  var alldata = [];
  // XXX JSON ?

  var dbid = req.params.dbid;
  var reportid = req.params.reportid;

  // Perl version - system("export PERL5LIB=$d/lib/; perl $d/bin/report $id $d/$report > /tmp/$$.pl 2> /tmp/$$.err");
  // report_dir: '/Users/scottp/nsip/HITS-Reports'
  // var root = os.homedir() + "/HITS-Reports";
  var root = "/home/ubuntu" + "/HITS-Reports";
  var cmd = root + "/bin/report";
  prc = spawn(root + "/bin/report", [dbid, reportid + "/in.pl"], {
    env: {"PERL5LIB": root + "/lib"},
    cwd: root,
  });

  prc.on('error', function(err) {
    logger.debug("REPORT: Error = " + err);
  });

  prc.stdout.on('data', function (data) {
    alldata = alldata + data.toString();
    logger.debug("REPORT: >" + data.toString());
  });

  prc.stderr.on('data', function (data) {
    logger.debug("REPORT: !" + data.toString());
    alldata.push(data.toString());
  });

  prc.on('close', function(code) {
    var ret;
    try {
       ret = JSON.parse(alldata.join(""));
    } catch (e) {
      console.error(e);
    }
    return res.json({
      data: ret,
    });
  });

});

module.exports = router;
