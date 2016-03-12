'use strict';

/**
 * @ngdoc function
 * @name signupApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the signupApp
 */
angular.module('signupApp')
  .controller('MainCtrl', function ($scope, $timeout, CCNode) {

    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    //Initialize our form data
    $scope.formData = {};
    //Our current form
    $scope.formNum = 1;
    //Variable for if we have a valid email
    $scope.validEmail = false;

    //initialize our error stack
    $scope.errors = [];

    //Our card height, setting it here statically
    //So we can transition it as we change form content
    //Timeout to make sure the dom is loaded before calculating
    var CCHeaderHeight;
    $scope.cardHeight = {
        'height': '1400px'
    }
    $timeout(function () {

        //Save the card header height
        //+ a little padding for smaller devices
        CCHeaderHeight = document.getElementById('CCHeader').clientHeight + 63;

        //+50px for the hidden button
        $scope.cardHeight = {
            'height': (document.getElementById('form1').clientHeight + CCHeaderHeight + 50) + "px"
        };
    }, 500);

    /**
     * Regex to Validate email field
     */
    $scope.validateEmail = function() {
        //Fetch email from giftcard form
        var email = $scope.formData.email;

        //Regex for all valid emails. To add a TLD, edit the final OR statement.
        var emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|co|com|org|net|edu|gov|mil|biz|info|mobi|name|aero|asia|jobs|museum)\b/;
        //Test the form email against the regex
        if (emailRegex.test(email)) {
            $scope.validEmail = true;
        } else {
            $scope.validEmail = false;
        }
    }

    //Function to submit the form
    //Also passng which form to go to next
    $scope.submitSignIn = function(nextForm) {

        //Going to set form to zero for loading
        $scope.formNum = 0;
        //And set the height to the spinner height
        $scope.cardHeight = {'height': CCHeaderHeight + 'px'}

        //Send our requests here
        //Prepare our ifttt payload
        var iftttPayload = {
            api: "ifttt",
            value1: $scope.formData.fName + $scope.formData.lName + "",
            value2: $scope.formData.email,
            value3: " "
        };

        //Post to ifttt
        CCNode.post(iftttPayload, function(response) {

            //Prepare our slack payload
            var slackPayload = {
                api: "slack",
                email: $scope.formData.email,
                first_name: $scope.formData.fName
            }

            //post to slack
            CCNode.post(slackPayload, function(response) {

                //Finally, prepare the github payload
                var githubPayload  ={
                    api: "github",
                    githubUsername: $scope.formData.githubUsername
                }

                CCNode.post(githubPayload, function(response) {

                    console.log("Success!");

                    //Do a short timeout
                    $timeout(function () {

                        //Set the actual values
                        $scope.formNum = nextForm;

                        //Apply scope here to make the dom change
                        $scope.$apply();

                        //Now set the new height
                        $scope.cardHeight = {
                            'height': (document.getElementById('form' + $scope.formNum).clientHeight + CCHeaderHeight) + "px",
                        };

                    }, 250);

                },
                //Error
                function(error) {

                    //Add the error to the error stack
                    $scope.errors.push("Error " + error.status + ": " + error.data.message);
                })
            },
            //Error
            function(error) {

                //Add the error to the error stack
                $scope.errors.push("Error " + error.status + ": " + error.data.message);
            })
        },
        //Error
        function(error) {

            //Add the error to the error stack
            $scope.errors.push("Error " + error.status + ": " + error.data.message);
        });



        //Placing form height change here since we are still testing things out
        //Do a short timeout
        $timeout(function () {

            //Set the actual values
            $scope.formNum = nextForm;

            //Apply scope here to make the dom change
            $scope.$apply();

            //Now set the new height
            $scope.cardHeight = {
                'height': (document.getElementById('form' + $scope.formNum).clientHeight + CCHeaderHeight) + "px",
            };

        }, 250);
    }

});
