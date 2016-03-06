var express = require('express');
var router = express.Router();

//Using request for super simple api requests
var request = require('request');

//Read our keys.json file
var fs = require("fs");

//Parse our keys.json
keys = JSON.parse(fs.readFileSync('keys.json', 'utf8'));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'I am a Hamburger' });
});

//Post to ifttt, google sheets
router.post('/ifttt', function(req, res, next) {

    //First check for keys
    if(!keys.iftttKey) {

        //Return an empty keys response
        res.json({
            "iftttStatus": 500,
            "iftttMessage": "Keys not found!"
        });
        return;
    }

    //Prepare our object
    //Value 1 = Atendee name
    //Value 2 = Atendee email
    //Value 3 = Atendee Org Opt-in
    var iftttPayload = {
        "value1": req.body.firstname + " " + req.body.lastname,
        "value2": req.body.email,
        "value3": req.body.orgs
    }

    //Make the request
    request.post(
        'https://maker.ifttt.com/trigger/sheets/with/key/' + keys.iftttKey,
        { form: iftttPayload },
        function (error, response, body) {

            //Get the ifttt message/error
            var iftttMessage;

            //Check if if it is json by trying to parse it
            try {

                //Parse the error
                JSON.parse(response.body);
                iftttMessage = JSON.parse(response.body).errors
            }
            catch(e) {
                iftttMessage = response.body
            }

            //Return the response
            res.json({
                "iftttStatus": response.statusCode,
                "iftttMessage": iftttMessage
            });
        }
    );
});

//Post to slack
router.post('/slack', function(req, res, next) {

    //Create our string of channels id's
    //can be retrieved from https://api.slack.com/methods/channels.list/test
    //Channels: challenges, event news, general, gigs, salon, sharing is caring, suggestionbox
    var channels = "C0EH5LV46,C0C52NYUA,C055VMWTH,C0H4U0VUJ,C0CA086KZ,C0BQHP207,C0BCA3GHL";

    //Create our slack payloadd
    var slackPayload = {
        "email": req.body.email,
        "channels": channels,
        "first_name": req.body.firstname,
        "token": keys.slackKey,
        "_attempts": 1
    };

    //Need to add the api url, as well as a EPOCH, unix time
    //Hence the date math in the query param
    request.post(
        "https://codeandcoffee.slack.com/api/users.admin.invite?t=" + Math.floor((new Date).getTime() / 1000),
        { form: slackPayload },
        function (error, response, body) {

            //Parse the json returned from slack
            var slackRes = JSON.parse(response.body);

            //Get a status code
            var slackStatus;
            if(slackRes.ok ||
                slackRes.error == "already_invited" ||
                slackRes.error == "already_invited") slackStatus = 200;
            else slackStatus = 409;

            //Return it to the frontend
            res.json({
                "slackStatus": slackStatus,
                "slackOk": slackRes.ok,
                "slackMessage": slackRes.error
            });
        }
    );
});

//Post to github
router.post('/github', function(req, res, next) {

    //Our payload
    var githubPayload = {
        "role": "member"
    }

    //Set up some headers for githubU user agent string
    //requests using baseRequest() will set the 'x-token' header
    var agentRequest = request.defaults({
      headers: {'User-Agent': 'CodeandCoffeeBotBeepBoop'}
    });

    agentRequest.put(
        "https://api.github.com/orgs/codeandcoffeelb/memberships/" + req.body.githubUsername,
        {
            json: true,
            body: githubPayload,
            auth: {
                "user": keys.githubUsername,
                "pass": keys.githubToken
            }
        },
        function (error, response, body) {

            //Send our response
            res.json({
                "gitStatus": response.statusCode,
                "gitMessage": response.body.message
            });
        }
    );

});

module.exports = router;
