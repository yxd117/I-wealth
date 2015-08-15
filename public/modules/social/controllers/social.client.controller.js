'use strict';

// Articles controller
angular.module('social').controller('SocialController', ['$scope', '$stateParams', '$location', 'Authentication', 
	function($scope, $stateParams, $location, Authentication) {
		$scope.user = Authentication.user;
		if (!$scope.user) $location.path('/');
	}
]);