// var uuid = require('node-uuid');
var db = require('../database');
var async = require('async');
var fs = require('fs')

var updateSQL;
async.series(
  [

    // Load SQL Files
    function(nexttop) {
      filename = process.argv[2];
      fs.readFile(filename, 'ascii', function(err, data) {
        if (err) {
          nexttop(err);
          return;
        }
        console.log('OK: ' + filename);
        data = data.replace(/\n;/gm,";");

        updateSQL = data.split(/;/);
        updateSQL = updateSQL.filter(function(n){ return ((n != "") && (n != "\n")) });

        console.log("Found " + updateSQL.length + " rules to apply");
        // console.log(updateSQL);

        nexttop();
      });
    },

    // Execute the SQL
    function(nexttop) {
      var infraconnection = db.infra();
      infraconnection.query(
        'SELECT databaseUrl FROM APPKEY_DB_URL_MAPPER',
        // [ req.params.dbid ],
        function(err, dbrows, fields) {
          console.log(err, dbrows);

          async.mapSeries(
            dbrows,
            function(row, next) {
              var inst = db.get(row.databaseUrl);

              async.mapSeries(
                updateSQL,
                function(sql, nextsql) {
                  inst.query(
                    sql,
                    function(lerr, ldbrows, lfields) {
                      console.log(row, lerr, ldbrows);
                      nextsql();
                    }
                  );
                },
                function() {
                  next();
                }
              );
            },
            function(err) {
              console.log("FINSIHED");
              nexttop();
            }
          );
        }
      );

    },
  ],
  function(err) {
    if (err) {
      console.log("ERROR ENDING: " + err, err);
    }
    console.log("End");
  }
);
