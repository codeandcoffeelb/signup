'use strict';

/**
 * @ngdoc function
 * @name signupApp.controller:FooterCtrl
 * @description
 * # FooterCtrl
 * Controller of the signupApp
 */
angular.module('signupApp')
  .controller('FooterCtrl', function ($scope, $timeout) {

    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    //Going to do a simple little timeout on the footer
    $scope.showFooter = false;

    $timeout(function () {
        $scope.showFooter = true;
    }, 1500);

  });
