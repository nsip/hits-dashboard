var crypto = require('crypto');
var moment = require('moment');
var request = require('request');

var secret = "nnn6WWgqVoHh";
var user = "vicgov";

// Push timestamp forward/back for testing (add or subtract)
var timestamp = moment().add('0', 'minutes').toISOString();

const hash = crypto
  .createHmac('sha256', secret)
  .update(user + ":" + timestamp)
  .digest('base64');
var full = (new Buffer.from(user + ":" + hash)).toString('base64');

// Send request
request.get(
   {
     // url: "http://hitstest.dev.nsip.edu.au/api/naplanresults/SchoolData/0bb5dfc0-0aa1-46ca-9533-a7af9eb02b65",
     // url: "http://hitstest.dev.nsip.edu.au/api/naplanresults/SchoolList",
     // url: "http://hitstest.dev.nsip.edu.au/api/naplanresults/TestData",
     url: "http://localhost:3000/api/naplanresults/SchoolData/0bb5dfc0-0aa1-46ca-9533-a7af9eb02b65",
     headers: {
       'Authorization': 'SIF_HMACSHA256 ' + full,
       'timestamp': timestamp,
     },
     json: {},
     gzip: true,
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
