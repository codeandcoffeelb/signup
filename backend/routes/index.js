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
  res.render('index', { title: 'Express' });
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
            console.log(response);
            console.log(error);
            if (!error && response.statusCode == 200) {
                res.send(200).json({
                    msg: "Success! :D"
                });
            }
            else {
                res.status(error.status).json({
                    msg: "An error has occured."
                });
            }
        }
    );

    //Now make org requests
    //Slack

    if(req.body.slack) {

        //Create our slack payloadd
        var slackPayload = {
            "email": req.body.email,
            "channels": "general",
            "first_name": req.body.firstname,
            "token": keys.slackKey,
            "_attempts": 1
        };

        //Need to add the api url, as well as a EPOCH, unix time
        //Hence the date math in the query param
        request.post(
            "https://codeandcoffee.slack.com/api/users.admin.invite?t=" + Math.floor((new Date).getTime() / 1000),
            { form: iftttPayload },
            function (error, response, body) {
                console.log(response);
                console.log(error);
                if (!error && response.statusCode == 200) {
                    res.send(200).json({
                        msg: "Success! :D"
                    });
                }
                else {
                    res.status(error.status).json({
                        msg: "An error has occured."
                    });
                }
            }
        );
    }



    //Github

    //First authenticate whichever admin
    //hosted the backend
    if(req.body.github) {

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
                form: iftttPayload,
                url: githubAuth
            },
            function (error, response, body) {
                console.log(response);
                console.log(error);
                if (!error && response.statusCode == 200) {
                    res.send(200).json({
                        msg: "Success! :D"
                    });
                }
                else {
                    res.status(error.status).json({
                        msg: "An error has occured."
                    });
                }
            }
        );
    }

});

module.exports = router;
