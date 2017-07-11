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
    var errors = [];
  // XXX JSON ?

  var dbid = req.params.dbid;
  var reportid = req.params.reportid;

  // Perl version - system("export PERL5LIB=$d/lib/; perl $d/bin/report $id $d/$report > /tmp/$$.pl 2> /tmp/$$.err");
  // report_dir: '/Users/scottp/nsip/HITS-Reports'
  // var root = os.homedir() + "/HITS-Reports";
  var home = "/home/ubuntu";
  var root = home + "/HITS-Reports";
  var cmd = root + "/bin/report";
  prc = spawn(root + "/bin/report", ["db/sif" + dbid, reportid + "/in.pl"], {
    env: {PERL5LIB: root + "/lib", HOME: home},
    cwd: root,
  });

  prc.on('error', function(err) {
    logger.debug("REPORT: Error = " + err);
    errors.push(err);
  });

  prc.stdout.on('data', function (data) {
    logger.debug("REPORT: >" + data.toString());
    alldata.push(data.toString());
  });

  prc.stderr.on('data', function (data) {
    logger.debug("REPORT: !" + data.toString());
    errors.push(data.toString());
  });

  prc.on('close', function(code) {
    var ret;
    try {
       ret = JSON.parse(alldata.join(""));
    } catch (e) {
      console.error(e);
        ret = { errors: e + "" };
    }
    ret.errors = ret.errors + errors.join("");
    return res.json({
      data: ret,
    });
  });

});

module.exports = router;
