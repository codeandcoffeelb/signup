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

    //Our card height, setting it here statically
    //So we can transition it as we change form content
    //Timeout to make sure the dom is loaded before calculating
    var CCHeaderHeight;
    $timeout(function () {

        //Save the card header height
        //+ a little padding for smaller devices
        CCHeaderHeight = document.getElementById('CCHeader').clientHeight + 63;

        //+50px for the hidden button
        $scope.cardHeight = {
            'height': (document.getElementById('form1').clientHeight + CCHeaderHeight + 50) + "px"
        };
    }, 10);

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

        //Send our requests here
        if(nextForm == 2) {

            //Prepare our payload
            var payload = {
                api: "ifttt",
                value1: $scope.formData.fName + $scope.formData.lName + "",
                value2: $scope.formData.email,
                value3: " "
            }

            //Post to CCnode
            CCNode.post(payload, function(response) {
                console.log(response);
            },
            //Error
            function(error) {
                console.log(error);
            });
        }

        //Lastly set the form height
        //Going to set to zero
        //Then timeout to allow for nice animations
        $scope.formNum = 0;
        $scope.cardHeight = {'height': CCHeaderHeight + 'px'}
        $timeout(function () {

            //Set the actual values
            $scope.formNum = nextForm;

            //Apply scope here to make the dom change
            $scope.$apply();

            //Now set the new height
            $scope.cardHeight = {
                'height': (document.getElementById('form' + $scope.formNum).clientHeight + CCHeaderHeight) + "px",
            };

        }, 750);
    }

});
