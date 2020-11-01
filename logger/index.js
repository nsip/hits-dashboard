/* NSIP hits dashboard
 */

var config = require('config');
var fs = require('fs');

if (!fs.existsSync(config.log.output)) fs.mkdirSync(config.log.output);

const winston = require('winston');
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console()
    ]
});

module.exports = logger;

/*
module.exports = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)({ 
			json: false, 
			timestamp: true, 
			level: 'debug' 
		}),
		new winston.transports.File({ 
			filename: config.log.output + '/debug.log', 
			json: true,
			level: config.log.level
		})
	],
	exceptionHandlers: [
		new (winston.transports.Console)({ 
			json: false, 
			timestamp: true 
		}),
		new winston.transports.File({ 
			filename: config.log.output + '/debug.log', 
			json: true 
		})
	],
	exitOnError: config.log.exitOnError
});

*/
