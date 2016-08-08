var db = require('../database');
console.log(db.create());

var connection = db.connect();
connection.query('SHOW TABLES', function(err, rows, fields) {
  if (err) throw err;

  console.log('The solution is: ', rows);
});

