var express = require('express');
var router = express.Router();
var db = require('../database');
var logger = require('../logger');
var uuid = require('node-uuid');
var config = require('config');
var Mailgun = require('mailgun-js');
var mailgun = new Mailgun({apiKey: config.mailgun.apiKey, domain: config.mailgun.domain});

// AUTHENTICATION - All routes here require authentication as admin
router.use(function (req, res, next) {
	// TODO
	console.log('XXX ADMIN Time:', Date.now());

	if (
		req
		&& req.session
		&& req.session.user
		&& req.session.user.username
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
		+  ' (SELECT max(`when`) FROM `database` WHERE account_id = account.id) as recent,'
		+  ' account.deactivated_at'
		+ ' FROM account'
		+ ' WHERE deleted_at IS NULL',
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
		"SELECT * FROM contact WHERE status <> 'done' AND status <> 'ignore'",
		function(err, rows, fields) {
			if (err)
				return res.error(err);
			
			res.contacts = rows;
			var connection2 = db.connect();
			
			connection2.query(
		        "SELECT * FROM account WHERE deleted_at IS NULL", 
		        function(err2, rows2, fields2) {
		            if (err2)
		                return res.error(err2);
		            
		            var newRows = [];
		            
		            for(var i=0; i<res.contacts.length; i++){
		                
		                var contact = res.contacts[i];
		                var data = contact.data;
		                
		                for(var j=0; j<rows2.length; j++){
		                    
		                    // see if there is an account for this email if there is
		                    // then set the account_id
		                    var email = rows2[j].email;
		                    
		                    if(data.indexOf(email) != -1) {
		                        contact.account_id = rows2[j].id;
		                        break;
		                    }
		                }
		                
		                newRows.push(contact);
		            }
		            
		            return res.json({
                        success: 1,
                        data: newRows
                    });
		        }
			)
		}
	);
});

router.get('/contact/:id', function(req, res) {
    var connection = db.connect();
    connection.query(
        "SELECT * FROM contact WHERE id='" + req.params.id + "'",
        function(err, rows, fields) {
            if (err)
                return res.error(err);
            
                var contactRow = rows[0];
                var raw = JSON.parse(contactRow.data);
            
                var secondConnection = db.connect();
                secondConnection.query(
                    "SELECT * FROM account WHERE email='" + raw['email'] + "' AND deleted_at IS NULL",
                    function(err2, rows2, fields2) {
                        if (err2)
                            return res.error(err2);
                        
                            var accountRow;
                            if(rows2.length > 0) accountRow = rows2[0]
                        
                            return res.json({
                                success: 1,
                                contact: contactRow,
                                account: accountRow
                            });
                    }
                );
        }
    );
});

// TODO - why not PUT?
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
				// TODO - Lookup contact information (other table) matched by this email address
				//	contact.account_id = account.id or req.params.id
				//	However - how does this get set. Perhaps an automatic update at the contact stage ?
				//	Also, technically could have multiple contacts from the one address. Which is ok, but which do we show
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

// DELETE
router.delete('/:id', function(req, res) {

    console.log("Entering delete");

    var connection = db.connect();
	connection.query(
		'UPDATE account SET deleted_at = NOW() WHERE id = ?',
		[ req.params.id ],
		function(err, rows, fields) {
			if (err){
				console.log(err);
			    return res.error(err);
			}
			return res.json({
				success: 1,
				title: "Record deleted",
				id: req.params.id
			});
		}
	);
});

router.put('/:id/deactivate', function(req, res) {
    // Update record
    
    console.log("Entering deactivate");

    var sql;
    if(req.body.isDeactivated && req.body.isDeactivated == 'true'){
        sql = 'UPDATE account SET deactivated_at = NOW() WHERE id = ?';
    } else {
        sql = 'UPDATE account SET deactivated_at = null WHERE id = ?'
    }
    
    var connection = db.connect();
    connection.query(
        sql,
        [ req.params.id ],
        function(err, rows, fields) {
            if (err){
                console.log(err);
                return res.error(err);
            }
            return res.json({
                success: 1,
                title: "Record Deactivated",
                id: req.params.id,
                isDeactivated: req.body.isDeactivated
            });
        }
    );
});

// PUT - update existing entry
router.put('/:id', function(req, res) {
	// Update record
    
    console.log("Entering update");

    var connection = db.connect();
    connection.query(
        'UPDATE account SET name = ?, email = ? WHERE id = ?',
        [ req.body.name, req.body.email, req.params.id ],
        function(err, rows, fields) {
            if (err){
                console.log(err);
                return res.error(err);
            }
            return res.json({
                success: 1,
                title: "Record Updated",
                id: req.params.id, 
                name: req.body.name,
                email: req.body.email
            });
        }
    );
});

module.exports = router;
