// XSP - eXperimental Service Paths

var express = require('express');
var app     = express();
var router  = express.Router();
var config = require('config');
var fs = require('fs');

var fileOrList = function(path, req, res) {
	fs.stat(path, function(err, stats) {

		// Stream File
		if (stats && stats.isFile()) {
			var stream = fs.createReadStream(path, { bufferSize: 64 * 1024 });
			// XXX Set headers etc
			// XXX GZIP compression?
			// XXX If Stream?
			console.log("STREAM", stream);
			stream.pipe(res);
			return;
		}

		// Show directory entries of type - or load from internal file
		else if (stats && stats.isDirectory()) {
			fs.stat(path + "/index", function(err, stats_index) {
				if (stats_index && stats_index.isFile()) {
					var stream = fs.createReadStream(path + "/index", { bufferSize: 64 * 1024 });
					stream.pipe(res);
					return;
				}

				// XXX Open directory and show
				res.json({
					success: false,
					title: "Not implemented - directory view without index file",
				});
				return;
			});
		}

		else {
			// XXX 404?
			res.json({
				success: false,
				title: "Not implemented - unknown type",
			});
			return;
		}
	});
	return;
};

// AUTHENTICATION - XXX We need a fake Bearer Token here !
router.use(function (req, res, next) {
  next();
});

// Return list of areas from config`
router.get('/', function (req, res) {
	return res.json({ success: 1, title: "Get list of tags", tags: config.xsp});
});

router.get('/:tag', function (req, res) {
	return fileOrList(config.xsp[req.params.tag].path, req, res);
});

// Return list of directories files & from config
router.get('/:tag/*', function (req, res) {
	return fileOrList(config.xsp[req.params.tag].path + "/" + req.params[0], req, res);
});

module.exports = router
