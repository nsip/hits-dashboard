var express = require('express');
var router = express.Router();
var db = require('../database');
var logger = require('../logger');
var uuid = require('node-uuid');

/*  Methods:
 *
 *  	get /:id	= Information
 *  	get /:id/entry/:auditId	XXX
 *  	get /:id/table/:tableName	Return rows in this table (max 1000)
 *
 */

// AUTHENTICATION - All routes here require authentication as admin
router.use(function (req, res, next) {
	// TODO
	console.log('XXX ADMIN Time:', Date.now());
	next();
});

// GET - list of accounts
router.get('/', function(req, res) {
	var connection = db.connect();
	connection.query('SELECT * FROM account', function(err, rows, fields) {
		if (err)
			return res.error(err);
		return res.json({
			success: 1,
			data: rows
		});
	});
});

// POST - Create an account
router.post('/', function(req, res) {
	var id = uuid.v4();
	var name = req.query.name;
	var email = req.query.email;

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

// GET - one account entry
router.get('/:id', function(req, res) {
	var connection = db.connect();
	connection.query('SELECT * FROM account', function(err, rows, fields) {
		if (err)
			return res.error(err);
		return res.json({
			success: 1,
			data: rows
		});
	});
});

// PUT - update existing entry
router.put('/:id', function(req, res) {
	// Update record
});

module.exports = router;

/*

package HITS::DevDash::Audit;
use perl5i::2;
use Dancer ':syntax';
use Dancer::Plugin::REST;
use Dancer::Plugin::Database;
use MIME::Base64;
use lib '../sif-au-perl/lib';
use lib '/home/scottp/nsip/sif-au-perl/lib';
use SIF::AU;

=head1 DATABASE

+------------------+---------------+------+-----+---------+----------------+
| Field            | Type          | Null | Key | Default | Extra          |
+------------------+---------------+------+-----+---------+----------------+
| id               | bigint(20)    | NO   | PRI | NULL    | auto_increment |
| requestTime      | datetime      | YES  |     | NULL    |                |
| responseTime     | datetime      | YES  |     | NULL    |                |
| clientIp         | varchar(45)   | YES  |     | NULL    |                |
| url              | varchar(255)  | YES  |     | NULL    |                |
| solutionId       | varchar(255)  | YES  |     | NULL    |                |
| appKey           | varchar(255)  | YES  |     | NULL    |                |
| userToken        | varchar(255)  | YES  |     | NULL    |                |
| context          | varchar(255)  | YES  |     | NULL    |                |
| instanceId       | varchar(45)   | YES  |     | NULL    |                |
| zone             | varchar(255)  | YES  |     | NULL    |                |
| environmentToken | varchar(255)  | YES  |     | NULL    |                |
| sessionToken     | varchar(255)  | YES  |     | NULL    |                |
| method           | varchar(45)   | YES  |     | NULL    |                |
| queryParameters  | varchar(2000) | YES  |     | NULL    |                |
| requestHeaders   | varchar(2000) | YES  |     | NULL    |                |
| request          | text          | YES  |     | NULL    |                |
| httpStatus       | int(11)       | YES  |     | NULL    |                |
| responseHeaders  | varchar(2000) | YES  |     | NULL    |                |
| response         | text          | YES  |     | NULL    |                |
+------------------+---------------+------+-----+---------+----------------+
20 rows in set (1.72 sec)

Primary protection = appKey (currently only HITS)

	SELECT
		id,
		requestTime, responseTime,
		clientIp, solutionId, appKey, instanceId, zone,
		method, queryParameters, requestHeaders, request,
		httpStatus, responseHeaders, response
	FROM
		XMLAudit
	WHERE
		appKey = 'HITS'
	ORDER BY
		id DESC
	LIMIT
		10

	SELECT
		id,
		requestTime, responseTime,
		method, queryParameters,
		httpStatus
	FROM
		XMLAudit
	WHERE
		appKey = 'HITS'
	ORDER BY
		id DESC
	LIMIT
		10


=cut

our $VERSION = '0.1';
prefix '/audit';
set serializer => 'mutable';

get '/' => sub {
	# TODO - API definition
};

get '/:userToken' => sub {
	# TODO - Show list for this ID (most recent 25, add params later)
	my $sth = database->prepare(q{
		SELECT
			id,
			url,
			requestTime, responseTime,
			method, queryParameters,
			httpStatus
		FROM
			XMLAudit
		WHERE
			userToken = ?
		ORDER BY
			id DESC
		LIMIT
			25
	});
	$sth->execute(params->{userToken});
	return {
		audit => $sth->fetchall_arrayref({}),
	};
};

get '/:userToken/entry/:auditId' => sub {
	my $sth = database->prepare(q{
		SELECT
			*
		FROM
			XMLAudit
		WHERE
			userToken = ? AND id = ?
	});
	$sth->execute(params->{userToken}, params->{auditId});
	my $data = $sth->fetchrow_hashref // {};

	# XML Analysis
	foreach my $type (qw/response request/) {
		my $xml = $data->{$type} // '';
		if ($xml) {
			eval {
				my $class = $xml;
				$class =~ s/>.*$//s;
				$class =~ s/^<//;
				$class =~ s/ .*$//;
				info("DETECTED $class");
				$class = "SIF::AU::$class";
				info("Converted $class");

				my $obj = $class->from_xml($xml);
				$obj->xml_validate();
			};
			if ($@) {
				info ($@);
				$data->{$type . "Analysis"} = $@ . "";
			}
			else {
				$data->{$type . "Analysis"} = "NO ERRORS / WARNINGS";
			}
		}
		else {
			$data->{$type . "Analysis"} = "NO XML";
		}
	}

	return $data;
};

true;
package HITS::DevDash::Info;
use perl5i::2;
use Dancer ':syntax';
use Dancer::Plugin::REST;
use Dancer::Plugin::Database;
use MIME::Base64;
use lib '../sif-au-perl/lib';
use lib '/home/scottp/nsip/sif-au-perl/lib';
use SIF::AU;

our $VERSION = '0.1';
prefix '/info';
set serializer => 'mutable';

get '/' => sub {
	# TODO - API definition
};

get '/:userToken' => sub {
	# TODO - Show list for this ID (most recent 25, add params later)
	my $sth = database->prepare(q{
		SELECT
			t.ENV_TEMPLATE_ID, t.PASSWORD, t.APP_TEMPLATE_ID, t.APP_TEMPLATE_ID,
			t.AUTH_METHOD, t.USER_TOKEN, t.APPLICATION_KEY, t.SOLUTION_ID,
			s.SESSION_TOKEN, s.ENVIRONMENT_ID
		FROM
			SIF3_APP_TEMPLATE t
			LEFT JOIN SIF3_SESSION s
			ON (s.SOLUTION_ID='HITS' AND s.APPLICATION_KEY=t.APPLICATION_KEY AND s.USER_TOKEN=t.USER_TOKEN)
		WHERE
			t.USER_TOKEN = ?
	});


	$sth->execute(params->{userToken});
	my $data = $sth->fetchrow_hashref // {};

	# MAP Data to empty values for login
	if ($data->{SESSION_TOKEN}) {
		$data->{ENVIRONMENT_URL} = "http://hits.dev.nsip.edu.au/SIF3InfraREST/hits/environments/" . $data->{ENVIRONMENT_ID};
		$data->{REQUEST_HREF} = "http://hits.dev.nsip.edu.au/SIF3InfraREST/hits/requests";
	}
	else {
		$data->{SESSION_TOKEN} = "Please create environment";
		$data->{ENVIRONMENT_URL} = "Please create environment";
		$data->{REQUEST_HREF} = "Please create environment";
	}

	$sth = database('HITS')->prepare(q{
		SELECT
			app.id app_id, app.name app_name, app.title app_title,
			vendor.name vendor_name, vendor.id vendor_id
		FROM
			app, vendor, app_login
		WHERE
			app.vendor_id = vendor.id
			AND app.id = app_login.app_id
			AND app_login.app_template_id = ?
	});
	$sth->execute($data->{APP_TEMPLATE_ID});
	my $hits = $sth->fetchrow_hashref // {};

	return {
		vendor => {
			id => $hits->{vendor_id},
			name => $hits->{vendor_name},
		},
		app => {
			id => $hits->{app_id},
			name => $hits->{app_name},
			title => $hits->{app_title},
		},
		info => {
			# XXX These names are wrong too - what is the right name?
			#	Check XML Environment as convention?
			href => "http://hits.dev.nsip.edu.au:8080/SIF3InfraREST/hits/environments/environment",
			template => $data->{ENV_TEMPLATE_ID},
			password => $data->{PASSWORD},
			instanceId => $data->{APP_TEMPLATE_ID},
			appTemplateId => $data->{APP_TEMPLATE_ID},
			authMethod => $data->{AUTH_METHOD},
			userToken => $data->{USER_TOKEN},
			applicationKey => $data->{APPLICATION_KEY},
			solutionId => $data->{SOLUTION_ID},
			sessionToken => $data->{SESSION_TOKEN},
			environmentURL => $data->{ENVIRONMENT_URL},
			requestHREF => $data->{REQUEST_HREF},
		}
	};
};

true;
package HITS::DevDash::Report;
use perl5i::2;
use Dancer ':syntax';
use Dancer::Plugin::REST;
use Dancer::Plugin::Database;
use MIME::Base64;

our $VERSION = '0.1';
prefix '/report';
set serializer => 'JSON';

# XXX NOTE templateId - should work of userToken or what ever that is replaced with

# XXX
# 	- List of previously run reports - including currently running
# 	- Single report by ID - show results of a single report
#	- Request run report (optional - report ID, normally chosen by current Use Case)

get '/:templateId' => sub {
	my $id = params->{templateId};
	$id =~ s/[^0-9]//g;
	my $report = params->{report} || "TimeTable";
	$report = "$report/in.pl";
	if (!$id || !$report) {
		die "No valid id or report requested";
	}

	# TODO - Have these created on request
	# 	- Created entries go into a database
	# 	- You can then view new or old entries, new ones not completed will
	# 	have another status

	my $d = config->{hits}{report_dir};

	system("export PERL5LIB=$d/lib/; perl $d/bin/report $id $d/$report > /tmp/$$.pl 2> /tmp/$$.err");

	my $in = do "/tmp/$$.pl";
	if ($@) {
		die "Failed to load /tmp/$$.pl - $@";
	}
	return $in;
};

true;
package HITS::DevDash::View;
use perl5i::2;
use Dancer ':syntax';
use Dancer::Plugin::REST;
use Dancer::Plugin::Database;
use MIME::Base64;

our $VERSION = '0.1';
prefix '/view';
set serializer => 'JSON';

# XXX now needs the token !

# List tables
get '/' => sub {
};

sub sif_db {
	my ($userToken) = @_;

	my $sth = database->prepare('SELECT databaseUrl FROM Zone WHERE zoneId = ?');
	$sth->execute($userToken);
	my $ref = $sth->fetchrow_hashref;
	my $db = $ref->{databaseUrl};

	if (!$db) {
		die "No valid DB from userToken $userToken";
	}

	my $dsn = config->{hits}{dsn_template};
	$dsn =~ s/TEMPLATE/$db/;
	return DBI->connect(
		$dsn,
		'sifau',
		'03_SIS_was_not',
		{ RaiseError => 1, AutoCommit => 1 }
	);
}

# List tables
get '/:userToken' => sub {
	my $ret = {};
	my $dbh = sif_db(params->{userToken});
	foreach my $t ($dbh->tables) {
		$t =~ s/^.+\.//;
		$t =~ s/'//g;
		$t =~ s/`//g;
		if ($t ne 'XMLAudit') {
			$ret->{$t} = {
				href => uri_for('view/' . $t) . '',
			};
		}
	}
	return {
		table => $ret,
	};
};

# List data
get '/:userToken/table/:id' => sub {
	# TODO - Add some href links & allow configurable limits, filters and sorting
	my $dbh = sif_db(params->{userToken});
	my $sth = $dbh->prepare('SELECT * FROM ' . params->{id} . ' LIMIT 250');
	info('SELECT * FROM ' . params->{id} . ' LIMIT 250');
	$sth->execute;
	return {
		data => $sth->fetchall_arrayref({}),
	};
};

true;

*/
