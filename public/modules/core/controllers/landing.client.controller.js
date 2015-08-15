'use strict';


angular.module('core').controller('LandingController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.user = Authentication.user;
	}
]);