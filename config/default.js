/* nsip/hits-dashboard
 */
module.exports = {
	"version": "0.0.1",	// See CHANGELOG.md

	"auth": {
		"scott": { "password": "NoneShallNSIP", "email": "scottp@dd.com.au" },
	},

	// Primary database
	"database": {
		driver: 'mysql',
		host: 'db.dev.nsip.edu.au',
		database: 'hits',
		user: 'hitsadmin',
		password: 'foxcrowbaker'
	},

	"log": {
		"output": "logs",
		"exitOnError": true,
		"level": "info"
	}
};
