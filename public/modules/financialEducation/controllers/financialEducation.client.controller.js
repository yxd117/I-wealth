'use strict';

// Articles controller
angular.module('financialEducation').controller('financialEducationController', ['$scope', '$rootScope', '$stateParams', '$location', 'Authentication', 'Users', '$q', 
  function($scope, $rootScope, $stateParams, $location, Authentication, Users, $q) {
      	$scope.user = Authentication.user;

        // If user is not signed in then redirect back home
        if (!$scope.user) $location.path('/');     


       }
]);