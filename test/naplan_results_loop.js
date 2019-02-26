var async = require('async');
var crypto = require('crypto');
var moment = require('moment');
var request = require('request');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var findDeep = require('find-deep');

var secret = "nnn6WWgqVoHh";
var user = "vicgov";

// Push timestamp forward/back for testing (add or subtract)
var timestamp = moment().add('0', 'minutes').toISOString();

const hash = crypto
  .createHmac('sha256', secret)
  .update(user + ":" + timestamp)
  .digest('base64');
var full = (new Buffer.from(user + ":" + hash)).toString('base64');

// Get list of School IDs
request.get(
   {
     url: "http://hits.nsip.edu.au:3000/api/naplantest/large/SchoolList/",
     headers: {
       'Authorization': 'SIF_HMACSHA256 ' + full,
       'timestamp': timestamp,
     },
     json: {},
      gzip: true,
   },
   function (error, response, body) {
     // console.log(response);
     if (!error) {
       console.log("Status", response.statusCode);
       // console.log("Body", body);

        parser.parseString(body, function(err,result){
          console.log("Parse Err", err);
          // console.log("Parse Results", result);
          // extractedData = result['data'];
          var schoolinfo = findDeep(result, (value, key) =>
            key == 'SchoolInfo'
          );

          var count = 0;
          async.eachLimit(
            schoolinfo,
            // NOTE: Concurrency - How many to perform at once
            1,
            function(school, next) {
              count++;
              var RefId = school['$'].RefId;
              console.log(RefId + " START " + count + " of " + schoolinfo.length);
              request.get(
                 {
                   url: "http://hits.nsip.edu.au:3000/api/naplantest/large/SchoolData/" + RefId,
                   headers: {
                     'Authorization': 'SIF_HMACSHA256 ' + full,
                     'timestamp': timestamp,
                   },
                   json: {},
                    gzip: true,
                 },
                 function (error, response, body) {
                   if (error) {
                    console.log(RefId + " ERROR = " + error);
                  }
                  else {
                    // XXX Check data returned is valid
                    console.log(RefId + " SUCCESS + " + response.statusCode);
                  }
                  next();
                }
              );
            },
            function(err) {
              if (err)
                console.log("ERROR", err);
              console.log("FINISHED");
            }
          );
        });
     }
     else {
       console.log("Error", error);
     }
   }
);
