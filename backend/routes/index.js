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
router.post('/signup', function(req, res, next) {

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
            if (!error && response.statusCode == 200) {

                //Sucess!
                //Request response for us here?
            }
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
            console.log(response);
            if (!error && response.statusCode == 200) {

                //Success!
                res.send(200);
            }
            else {

                //Error
                res.send(response.statusCode);
            }
        }
    );
});

//Post to github
router.post('/github', function(req, res, next) {

    //Create our github basic auth
    var username = keys.githubUsername;
    token = keys.githubToken;
    url = 'http://' + username + ':' + token + '@https://api.github.com/orgs/codeandcoffeelb/memberships/' + req.body.githubUsername;

    //Create our github payload
    var githubPayload = {
        "role": "member"
    };

    request.put(
        "https://api.github.com/orgs/codeandcoffeelb/memberships/" + req.body.githubUsername,
        {
            form: githubPayload,
            url: githubAuth
        },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {

                //Sucess!
            }
        }
    );
});

module.exports = router;
