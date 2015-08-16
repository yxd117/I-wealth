'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/settings/questionnaire');

			}).error(function(response) {
				
				$scope.error = response.message;
				
			});
		};

		$scope.signin = function() {

			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;
				var completeQns = $scope.authentication.user.completeQns;

				// And redirect to the index page
				var userType = $scope.authentication.user.roles;
				if (userType[0].localeCompare('admin') === 0) {
					$location.path('/adminconsole');
				}else{
					if (!completeQns)$location.path('/settings/questionnaire');
					else $location.path('/home');					
				}


			}).error(function(response) {
				
				$scope.error = response.message;
				
			});
		};
	}
]);