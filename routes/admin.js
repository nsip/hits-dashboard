var express = require('express');
var router = express.Router();
var db = require('../database');
var logger = require('../logger');
var uuid = require('node-uuid');
var Mailgun = require('mailgun-js');
var mailgun = new Mailgun({apiKey: 'key-df32edce350d1ce87c630dfe40f39d2f', domain: 'hits.nsip.edu.au'});
// pubkey-e9b8fb5cf3be0d644c9c970086c72b48
// key-df32edce350d1ce87c630dfe40f39d2f

// AUTHENTICATION - All routes here require authentication as admin
router.use(function (req, res, next) {
	// TODO
	console.log('XXX ADMIN Time:', Date.now());

	if (
		req
		&& req.session
		&& req.session.user
	) {
		console.log("Valid login... continue");
	}
	else {
		console.log("No valid login - redirect");
		// XXX doesn't work, since redirect of JSON request !
		// XXX How - res.redirect?
		// return res.redirect("/login.html");
		return res.json({success: false, redirect: 'login.html' });
	}

	next();
});

// GET - list of accounts
router.get('/', function(req, res) {
	var connection = db.connect();
	connection.query(
		'SELECT account.id, account.name, account.email, '
		+  ' (SELECT count(*) FROM `database` WHERE account_id = account.id) as count, '
		+  ' (SELECT max(`when`) FROM `database` WHERE account_id = account.id) as recent'
		+ ' FROM account',
		function(err, rows, fields) {
			if (err)
				return res.error(err);
			return res.json({
				success: 1,
				data: rows
			});
		}
	);
});

// POST - Create an account
router.post('/', function(req, res) {
	var id = uuid.v4();
	var name = req.body.name;
	var email = req.body.email;

	var connection = db.connect();
	connection.query(
		'INSERT INTO account (id,name,email) VALUES (?,?,?)',
		[ id, name, email ],
		function(err, rows, fields) {
			if (err)
				return res.error(err);

			return res.json({
				success: 1,
				id: id
			});
		}
	);
});

router.get('/test/mail', function(req, res) {
	/* res.mailer - see app.js
	res.mailer.send('email', {
     to: 'scottp@dd.com.au', // REQUIRED. This can be a comma delimited string just like a normal email to field.
     subject: 'Test Email', // REQUIRED.
     otherProperty: 'Other Property' // All additional properties are also passed to the template as local variables.
   }, function (err) {
     if (err) {
       // handle error
       console.log(err);
       res.send('There was an error sending the email = ' + err);
       return;
     }
     res.send('Email Sent');
   });
	 */

	 /* Mail Gun

	 */
	var data = {
		from: 'info@nsip.edu.au',
		to: "scooter.me@gmail.com",
		subject: "Test subject",
		// html: templatedata,
		text: "This is the body",
	};
	mailgun.messages().send(data, function(err, body) {
		//If there is an error, render the error page
		if (err) {
			console.log("EMAIL: error: ", err);
			res.statu(400).json({success: false, message: "Error - " + err});
		}
		//Else we can greet    and leave
		else {
			console.log("EMAIL: Success: ", body);
			res.json({success: true, body: body});
		}
	});
});

router.get('/contact', function(req, res) {
	var connection = db.connect();
	connection.query(
		"SELECT * FROM contact WHERE status <> 'done'",
		function(err, rows, fields) {
			if (err)
				return res.error(err);
			return res.json({
				success: 1,
				data: rows
			});
		}
	);
});

router.post('/contact/:id', function(req, res) {
	var connection = db.connect();
	connection.query(
		"UPDATE contact SET status = ? WHERE id = ?",
		[ req.body.status, req.params.id],
		function(err, rows, fields) {
			if (err)
				return res.error(err);
			return res.json({
				success: 1,
				data: rows
			});
		}
	);
});


// GET - one account entry
router.get('/:id', function(req, res) {
	var connection = db.connect();
	connection.query(
		'SELECT * FROM account WHERE id = ?',
		[ req.params.id ],
		function(err, rows, fields) {
			if (err)
				return res.error(err);
			if (rows.length) {
				return res.json({
					success: 1,
					data: rows[0]
				});
			}
			else {
				return res.json({
					success: 0,
					message: 'not found'
				});
			}
		}
	);
});

// PUT - update existing entry
router.put('/:id', function(req, res) {
	// Update record
});

module.exports = router;
