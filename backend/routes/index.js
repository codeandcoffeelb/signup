var express = require('express');
var router = express.Router();

//Using request for super simple api requests
var request = require('request');

//Our api key
//Do not add this until build
var iftttKey = "";

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

});

module.exports = router;
