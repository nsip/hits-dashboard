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
		host: 'sifau.cspvdo7mmaoe.ap-southeast-2.rds.amazonaws.com',
		database: 'hits',
		user: 'sifau',
		password: '03_SIS_was_not'
	},

	"log": {
		"output": "logs",
		"exitOnError": true,
		"level": "info"
	}
};
