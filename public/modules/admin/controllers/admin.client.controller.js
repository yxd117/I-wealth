'use strict';

angular.module('admin').controller('AdminController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.user = Authentication.user;

		// If user is signed in then redirect back home
		
		if (!$scope.user) {
			$location.path('/');
		}else{
			var userType = $scope.user.roles;
			if (userType[0].localeCompare('admin') !== 0) $location.path('/');
		}
		


	}
]);