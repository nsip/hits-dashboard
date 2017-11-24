var config = require('config');
var mysql      = require('mysql');
var connection = mysql.createPool({
    connectionLimit : 25,
	host     : config.database.host,
	user     : config.database.user,
	password : config.database.password,
	database : config.database.database
});
connection.on('connection', function (connection) {
  console.log('connection: mysql Connection');
});
connection.on('enqueue', function () {
  console.log('connection: Waiting for available connection slot');
});
connection.on('release', function (connection) {
  console.log('connection: Connection %d released', connection.threadId);
});

var connections = {};

var infra = mysql.createPool({
    connectionLimit : 25,
	host     : config.database.host,
	user     : config.database.user,
	password : config.database.password,
	database : 'hits_sif3_infra',
});
infra.on('connection', function (connection) {
  console.log('infra: mysql Connection');
});
infra.on('enqueue', function () {
  console.log('infra: Waiting for available connection slot');
});
infra.on('release', function (connection) {
  console.log('infra: connection: Connection %d released', connection.threadId);
});

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
                multipleStatements: true,
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
