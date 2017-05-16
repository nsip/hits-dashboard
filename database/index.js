var config = require('config');
var mysql      = require('mysql');
var connection = mysql.createConnection({
	host     : config.database.host,
	user     : config.database.user,
	password : config.database.password,
	database : config.database.database
});
connection.connect();

var connections = {};

var infra = mysql.createConnection({
	host     : config.database.host,
	user     : config.database.user,
	password : config.database.password,
	database : 'hits_sif3_infra',
});
infra.connect();


module.exports = {
	connect: function() { return connection },
	infra: function() { return infra },
	get: function(name) {
        // Caching connections
        if (! connections[name]) {
            connections[name] =  mysql.createConnection({
                host     : config.database.host,
                user     : config.database.user,
                password : config.database.password,
                database : name,
            });
						// XXX Connection error auto close
						// connection.on('error', function() {});
        }
        return connections[name];
	},
	close: function(name) {
		// XXX Close and then remove from connection hash
    if (connections[name]) {
			connections[name].end();
			delete connections[name];
		}
	},
	create: function(name, cb) {
		// XXX Don't we need a callback ?
		// XXX Check DB is ok. Create and return
	},
};
