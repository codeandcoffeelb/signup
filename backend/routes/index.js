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
router.post('/sheets', function(req, res, next) {

    //Prepare our object
    //Value 1 = Atendee name
    //Value 2 = Atendee email
    //Value 3 = Atendee Org Opt-in
    var iftttPayload = {
        "value1": req.body.name,
        "value2": req.body.email,
        "value3": req.body.orgs
    }

    //Make the request
    request.post(
        'https://maker.ifttt.com/trigger/sheets/with/key/' + iftttKey,
        { form: iftttPayload },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.send(200).json({
                    msg: "Success! :)"
                });;
            }
            else {
                res.status(error.status).json({
                    msg: "An error has occured."
                });
            }
        }
    );
});

module.exports = router;
