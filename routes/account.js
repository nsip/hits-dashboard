var config = require('config');
var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var db = require('../database');
var requestify = require('requestify');
var logger = require('../logger');
var async = require('async');

// AUTHENTICATION - All entries start with base URL
router.use(function (req, res, next) {
  // XXX check :accountId and form error
  console.log('Time:', Date.now());
  next();
});

// GET / = Return list of information
router.get('/:accountId', function(req, res, next) {
  // Especially show status
  var connection = db.connect();
  connection.query(
    'SELECT * FROM `account` WHERE id = ? AND deleted_at IS NULL',
    [ req.params.accountId ],
    function(err, rows, fields) {
      if (err)
        return res.error(err);
            if (rows && rows.length) {
                return res.json({
                    success: 1,
                    data: rows[0]
                });
            }
            else {
                return res.error("not found");
            }
    }
    );
});

// GET /database = Return a list of databases
router.get('/:accountId/database', function(req, res, next) {
  var connection = db.connect();
  connection.query(
    'SELECT * FROM `database` WHERE account_id = ? AND deleted_at IS NULL ORDER BY name',
    [ req.params.accountId ],
    function(err, rows, fields) {
      if (err)
        return res.error(err);

      for (var i = 0; i < rows.length; i++) {
        try {
          // Overloaded name options, optiondata, opdata !!!
          rows[i].opdata = JSON.parse(rows[i].optiondata);
        }
        catch(e) {
          console.error(e);
        }
        rows[i].opdata = rows[i].opdata || {};
      }
      return res.json({
        success: 1,
        data: rows
      });
    }
  );
});

// Get DAtabases with counts for each
router.get('/:accountId/counts', function(req, res, next) {
  var connection = db.connect();
  var infraconnection = db.infra();
  connection.query(
    'SELECT * FROM `database` WHERE account_id = ? AND deleted_at IS NULL',
    [ req.params.accountId ],
    function(err, rows, fields) {
      if (err)
        return res.error(err);

      console.log("ROWS", rows);

      var ret = [];
      async.mapSeries(
        rows,
        function(row, step) {
          infraconnection.query(
              'SELECT databaseUrl FROM APPKEY_DB_URL_MAPPER WHERE applicationKey = ?',
              [ row.id ],
              function(err, dbrows, fields) {
                console.log("ONE ROW", err, dbrows);
                if (!dbrows || !dbrows[0]) {
                  row.errors = "not found";
                  row.schools = 0;
                  row.students = 0;
                  row.teachers = 0;
                  row.opdata = row.opdata || {};
                  ret.push(row);
                  step();
                  return null;
                }

                var dbc = db.get(dbrows[0].databaseUrl);
                dbc.query(
                  'SELECT (SELECT COUNT(*) FROM SchoolInfo) as schools, (SELECT COUNT(*) FROM StudentPersonal) as students, (SELECT COUNT(*) FROM StaffPersonal) as teachers',
                  function(err, counts, cfields) {
                    console.log("COUNTS", err, counts);
                    if (err) {
                      row.errors = err + "";
                      row.schools = 0;
                      row.students = 0;
                      row.teachers = 0;
                    }
                    else {
                      row.errors = null;
                      row.schools = counts[0].schools;
                      row.students = counts[0].students;
                      row.teachers = counts[0].teachers;
                    }

                    // Expand opdata
                    try {
                      row.opdata = JSON.parse(row.optiondata);
                    }
                    catch(e) {
                      console.error(e);
                    }
                    row.opdata = row.opdata || {};

                    ret.push(row);
                    db.close(dbrows[0].databaseUrl);
                    step();
                  }
                );
              }
            );
        },
        function(err) {
          if (err) {
            return res.status(400).json({
              success: 0,
              error: err + "",
            });
          }
          return res.json({
            success: 1,
            data: ret,
          });
        }
      );
    }
  );
});

/*
Counts ! Do this as an extended view of database above to reduce load time
SELECT
  (SELECT COUNT(*) FROM SchoolInfo) as SchoolInfo,
  (SELECT COUNT(*) FROM StudentPersonal) as StudentPersonal,
  (SELECT COUNT(*) FROM StaffPersonal) as StaffPersonal
*/

// POST /database = Create a database !
router.post('/:accountId/database', function(req, res, next) {

  console.log(req.params, req.body);

  // * Create UUID
  var id = uuid.v4();
  id = id.replace(/-/g,"");
  var name = req.body.name || "no name";
  var type = req.body.type || "empty";
  var options = req.body.options || {};

  var connection = db.connect();

  connection.query(
    "INSERT INTO `database` (account_id, id, name, status, options, optiondata, `when`) VALUES (?,?,?,'waiting', ?, ?, NOW())",
    [ req.params.accountId, id, name, type, JSON.stringify(options) ],
    function(err, rows, fields) {
      if (err)
        return res.error(err);

      // TODO - Build Time for Database
      // TODO - Allow very long times for huge builds

      // * Do GET above in background

      // XXX Change this to check value of return straight away
      logger.debug("REMOTE: Sending request GET " +
				config.create.base
                                + '?name=' + id
                                + '&encode=json'
                                + '&type=' + type
      );
      requestify.get(
	config.create.base
        + '?name=' + id
        + '&encode=json'
        + '&type=' + type,
        {
          timeout: 300000  // Long timeout for slow DB Build (XXX is this needed any more?)
        }
      )
      .then(function(response) {
        logger.debug("REMOTE: Response.", response.getBody());
        // Updated within script if working ok
        return;
      })
      .fail(function(response) {
        // XXX logger
        connection.query(
          "UPDATE `database` SET status = ? WHERE id = ?",
          [ 'error', id ],
          function(err, rows, fields) {
            if (err)
              return logger.error("ERROR: " + err, err);
            logger.info("UPDATE: XXX");
          }
        );
      });

      // * Return immediate data
      return res.json({
        success: 1,
        id: id,
        status: 'building'
      });
    }
  );
});

// DELETE /database = Create a database !
router.delete('/:accountId/database/:dbId', function(req, res, next) {

  var connection = db.connect();

  connection.query(
    'UPDATE `database` SET deleted_at = now() WHERE account_id = ? AND id = ?',
    [ req.params.accountId, req.params.dbId ],
    function(err, rows, fields) {
      if (err)
        return res.error(err);

      return res.json({
        success: 1
      });

    }
  );

});

//deleted_at

// GET /database/:id = Return a single database details
router.get('/:accountId/database/:dbId', function(req, res, next) {
  var connection = db.connect();
  var infraconnection = db.infra();
  connection.query(
    'SELECT * FROM `database` WHERE account_id = ? AND id = ?',
    [ req.params.accountId, req.params.dbId ],
    function(err, rows, fields) {
      if (err)
        return res.error(err);

      var ret = rows[0];

      // Use the version id to get the config messages
      var databaseMessages = config.database_version_messages;
      var messageVersions = Object.keys(databaseMessages).sort();

      var version = 0;
      if(ret.version_num) version = ret.version_num;

      var messages = [];
      if(version < config.database_current_version){

          for(var i=0; i<messageVersions.length; i++){
              if(version < messageVersions[i]){
                  for(var j=0; j<databaseMessages[messageVersions[i]].length; j++){
                      messages.push(databaseMessages[messageVersions[i]][j]);
                  }
              }
          }
      }

      ret.database_version_messages = messages;

      infraconnection.query(
        "SELECT "
        + "        t.ENV_TEMPLATE_ID, t.PASSWORD, t.APP_TEMPLATE_ID, t.APP_TEMPLATE_ID, "
        + "        t.AUTH_METHOD, t.USER_TOKEN, t.APPLICATION_KEY, t.SOLUTION_ID, "
        + "        s.SESSION_TOKEN, s.ENVIRONMENT_ID "
        + "FROM "
        + "        SIF3_APP_TEMPLATE t "
        + "        LEFT JOIN SIF3_SESSION s "
        + "        ON (s.SOLUTION_ID='HITS' AND s.APPLICATION_KEY=t.APPLICATION_KEY AND s.USER_TOKEN=t.USER_TOKEN) "
        + "WHERE "
        + "        t.USER_TOKEN = ? "
        ,
        [ req.params.dbId ],
        function(e2, r2, f2) {
          console.log("SELECT ENVIRONMENT_ID,SESSION_TOKEN FROM SIF3_SESSION WHERE APPLICATION_KEY = ?", req.params.dbId);
          if (e2)
            return res.error(e2);

          console.log(r2);

          if (r2 && r2[0]) {
            ret.session = r2[0].SESSION_TOKEN;
            ret.environment = r2[0].ENVIRONMENT_ID;
            ret.auth_method = r2[0].AUTH_METHOD;
          }
          else {
            ret.session = "";
            ret.environment = "";
            ret.auth_method = "";
          }

          return res.json({
            success: 1,
            data: ret,
          });
        }
      );
    }
  );
});

module.exports = router;
