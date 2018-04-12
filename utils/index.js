var logger = require('../logger');
module.exports = function (req, res, next) {

	res.error = function (err, area, type) {
		area = area || "Undefined";
		logger.error(area + ": " + err, err);
		return res.status(400).json({
			success: 0,
			error: err,
			message: area + ": " + err,
			area: area, 
			type: type
		});
	};
	next();
};
