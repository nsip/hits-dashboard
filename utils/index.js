var logger = require('../logger');
module.exports = function (req, res, next) {

	res.error = function (err, area) {
		area = area || "Undefined";
		logger.error(area + ": " + err, err);
		return res.json({
			success: 0,
			error: err,
			message: area + ": " + err
		});
	};

	var app = require('express')(),
	    mailer = require('express-mailer');

	res.mail = function() {
		mailer.extend(app, {
		  from: 'no-reply@example.com',
		  host: 'smtp.gmail.com', // hostname
		  secureConnection: true, // use SSL
		  port: 465, // port for secure SMTP
		  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
		  auth: {
		    user: 'gmail.user@gmail.com',
		    pass: 'userpass'
		  }
		});
	};

	next();
};
