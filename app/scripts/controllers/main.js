'use strict';

/**
 * @ngdoc function
 * @name signupApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the signupApp
 */
angular.module('signupApp')
  .controller('MainCtrl', function ($scope, $timeout) {

    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    //Initialize our form data
    $scope.formData = {};
    //Variable for if we have a valid email
    $scope.validEmail = false;

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

});
