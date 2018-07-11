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

// AUTHENTICATION - All entries start with base URL
router.use(function (req, res, next) {
  // XXX check :accountId and form error
  console.log('Time:', Date.now());
  next();
});

// Return list of areas from config`
router.get('/', function (req, res) {
	return res.json({ success: 1, title: "Get list of tags", tags: config.xsp});
});

// XXX Next three could be the same

// Return list of directories files & from config
router.get('/:tag', function (req, res) {
	return fileOrList(config.xsp[req.params.tag].path, req, res);
});

// Return list of files in directory OR file
router.get('/:tag/:area', function (req, res) {
	return fileOrList(config.xsp[req.params.tag].path + "/" + req.params.area, req, res);
});

// Return single file
router.get('/:tag/:area/:id', function (req, res) {
	return fileOrList(config.xsp[req.params.tag].path + "/" + req.params.area + "/" + req.params.id, req, res);
});

// XXX We could allow recursive or deeper?

module.exports = router
