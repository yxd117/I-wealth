'use strict';

// Setting up route
angular.module('admin').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('adminUsers', {
			url: '/admin/users',
			templateUrl: 'modules/admin/views/admin-users.client.view.html'
		}).
		state('adminAssets', {
			url: '/admin/assets',
			templateUrl: 'modules/admin/views/admin-assets.client.view.html'
		}).
		state('adminStatistics', {
			url: '/admin/statistics',
			templateUrl: 'modules/admin/views/admin-statistics.client.view.html'
		});
	}
]);