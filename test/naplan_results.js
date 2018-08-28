var crypto = require('crypto');
var moment = require('moment');
var request = require('request');

var secret = "XYZ";
var user = "ABC";
var timestamp = "123";

const hash = crypto
  .createHmac('sha256', secret)
  .update(user + ":" + timestamp)
  .digest('base64');
var full = (new Buffer.from(user + ":" + hash)).toString('base64');

// Send request
request.get(
   {
     url: "http://hitstest.dev.nsip.edu.au/api/naplanresults",
     headers: {
       'Authorization': 'SIF_HMACSHA256 ' + full,
       'timestamp': timestamp,
     },
     json: {},
   },
   function (error, response, body) {
     if (!error) {
       console.log("Body", body);
     }
     else {
       console.log("Error", error);
     }
   }
);
