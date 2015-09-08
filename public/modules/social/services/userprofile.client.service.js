'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('social').factory('UserProfile', ['$resource',
  function ($resource) {
    return $resource('/api/social/:profileId', {
      profileId: '@userObjectId'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);