/* nsip/hits-dashboard
 */
module.exports = {
	"version": "0.0.1",	// See CHANGELOG.md

	"auth": {
		"scott": { "password": "NoneShallNSIP", "email": "scottp@dd.com.au" },
		"peter": { "password": "NoneShallNSIP", "email": "peter.haydon@nsip.edu.au" },
		"matt": { "password": "NoneShallNSIP", "email": "matt.farmer@nsip.edu.au" },
		"nick": { "password": "NoneShallNSIP", "email": "nick.nicholas@nsip.edu.au" },
		"linda": { "password": "NoneShallNSIP", "email": "linda.marshall@nsip.edu.au" },
		"raf": { "password": "NoneShallNSIP", "email": "rafidzal.rafiq@systemic.com.au" },
		"joerg": { "password": "NoneShallNSIP", "email": "joerg.huber@gmail.com" },
		"georgina": { "password": "NoneShallNSIP", "email": "Georgina.Johnston@nsip.edu.au" },
		"fran": { "password": "NoneShallNSIP", "email": "nashiralyana@gmail.com" },
	},

	/*
	// Production DB
	"database": {
		driver: 'mysql',
		host: 'db.dev.nsip.edu.au',
		database: 'hits',
		user: 'hitsadmin',
		password: 'foxcrowbaker'
	},

	// Production create
	"create": {
		base: "http://hits.nsip.edu.au/dbcreate",
	},
	*/

	// Test DB
	"database": {
		driver: 'mysql',
		host: 'testdb.dev.nsip.edu.au',
		database: 'hits',
		user: 'hitstest',
		password: 'foxcrowbaker'
	},
	// Test Create
  "create": {
    base: "http://hitstest.dev.nsip.edu.au/dbcreate",
  },

	"log": {
		"output": "logs",
		"exitOnError": true,
		"level": "info"
	},

    "nsip": {
        "projects": [
            'a',
            'b',
        ],
    },

};
