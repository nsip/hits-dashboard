var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var serveIndex = require('serve-index');

// XXX Add Winston logging including express winston
// XXX Add basic login function

var app = express();

// Session handles
app.set('trust proxy', 1); // trust first proxy
app.use(session({
  secret: 'NSIP has Administration again',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }	// Really ?
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'right/dist')));
app.use("/usecases", express.static(path.join(__dirname, '../usecases/raw')));

// TODO Separate entry, location, files etc
app.use("/usecasedev", express.static("../usecases/raw"));
app.use('/usecasedev', serveIndex("../usecases/raw", {'icons': true}));

app.use(require('./utils'));

var mailer = require('express-mailer');
mailer.extend(app, {
  from: 'nsiphits@gmail.com',
  host: 'smtp.gmail.com', // hostname
  secureConnection: true, // use SSL
  port: 465, // port for secure SMTP
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
  auth: {
    user: 'nsiphits@gmail.com',
    pass: 'NoneShallNSIP',
  }
});

// Routes all at /api
app.use('/api/admin', require('./routes/admin'));
app.use('/api/update', require('./routes/update'));
app.use('/api/account', require('./routes/account'));
app.use('/api/recover', require('./routes/recover'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/database', require('./routes/database'));
// XXX app.use('/build', require('./routes/build'));
app.use('/api/login', require('./routes/login')());
app.use('/api/audit', require('./routes/audit'));
app.use('/api/report', require('./routes/report'));
app.use('/api/about', require('./routes/about'));

// NODEAdmin - Access to MySQL - needs security
// var nodeadmin = require('nodeadmin');
// app.use(nodeadmin(app));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
