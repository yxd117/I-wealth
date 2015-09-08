'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('social').factory('Post', ['$resource',
  function ($resource) {
    return $resource('api/posts/:postId', {
      postId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
