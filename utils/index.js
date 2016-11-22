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
	next();
};
