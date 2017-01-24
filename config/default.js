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
