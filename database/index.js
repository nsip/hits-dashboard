var config = require('config');
var mysql      = require('mysql');
var connection = mysql.createConnection({
	host     : config.database.host,
	user     : config.database.user,
	password : config.database.password,
	database : config.database.database
});

module.exports = {
	connect: function() { return connection },
	get: function(name) {
		// XXX how come not a clallback ?
		return mysql.createConnection({
			host     : 'localhost',
			user     : 'root',	// CONFIG
			password : '',
			database : name
		});
	},
	create: function(name, cb) {
		// XXX Don't we need a callback ?
		// XXX Check DB is ok. Create and return
		return "Fred was here";
	}
};
