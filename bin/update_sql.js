// var uuid = require('node-uuid');
var db = require('../database');
var async = require('async');

var updateSQL = [
  " \
            -- #170 \
            ALTER TABLE TimeTable_Day \
            ADD COLUMN id INT(11) NOT NULL AUTO_INCREMENT FIRST, \
            ADD PRIMARY KEY (id); \
  ",
  " \
            ALTER TABLE TimeTable_Period \
            ADD COLUMN id INT(11) NOT NULL AUTO_INCREMENT FIRST, \
            ADD COLUMN TimeTable_Day_Id INT(11), \
            ADD PRIMARY KEY (id); \
  ",
  " \
              UPDATE TimeTable_Period p set TimeTable_Day_Id = (select min(d.id) from TimeTable_Day d where d.TimeTable_RefId = p.TimeTable_RefId and d.DayId = p.DayId); \
  ",
  " \
            ALTER TABLE TimeTable_Period \
            DROP FOREIGN KEY TimeTable_Period_ibfk_1; \
  ",
  " \
            ALTER TABLE TimeTable_Period \
            CHANGE COLUMN TimeTable_Day_Id TimeTable_Day_Id INT(11) NOT NULL , \
            ADD INDEX TimeTable_Period_ibfk_1_idx (TimeTable_Day_Id ASC); \
  ",
  " \
            ALTER TABLE TimeTable_Period \
            ADD CONSTRAINT TimeTable_Period_ibfk_1 \
            FOREIGN KEY (TimeTable_Day_Id) \
            REFERENCES TimeTable_Day (id); \
  ",
  " \
            -- #154 \
            ALTER TABLE TeachingGroup ADD COLUMN TimeTableSubject_RefId VARCHAR(36) NULL; \
  ",
];


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
      }
    );
  }
);
