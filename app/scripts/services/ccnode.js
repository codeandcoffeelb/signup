'use strict';

/**
 * @ngdoc service
 * @name signupApp.CCNode
 * @description
 * # CCNode
 * Service in the signupApp.
 */
angular.module('signupApp')
  .service('CCNode', function ($resource) {

      //Enter our backend url
      var apiUrl = "http://signin.codeandcoffeelb.org:3000";
      var localhost = "http://localhost:3000"

      //Return the post
      return $resource(localhost + '/:api', {
          api: '@api'
      },
      {
          post: {
            method: 'POST',
            params: {
              api: '@api'
            },
            isArray: false
      }
    });
  });
