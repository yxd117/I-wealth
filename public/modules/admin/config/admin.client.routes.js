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
		state('adminStatistics1', {
			url: '/admin/statistics',
			templateUrl: 'modules/admin/views/admin-statistics.client.view.html'
		}).
		state('adminStatistics2', {
			url: '/admin/statistics/financialHealth',
			templateUrl: 'modules/admin/views/admin-statistics-financialHealth.client.view.html'
		}).
		state('adminStatistics3', {
			url: '/admin/statistics/financialSummary',
			templateUrl: 'modules/admin/views/admin-statistics-usageFinancialSummary.client.view.html'
		}).
		state('adminStatistics4', {
			url: '/admin/statistics/milestones',
			templateUrl: 'modules/admin/views/admin-statistics-milestoneCompletion.client.view.html'
		}).
		state('adminStatistics5', {
			url: '/admin/statistics/socialActivity',
			templateUrl: 'modules/admin/views/admin-statistics-socialActivity.client.view.html'
		});
	}
]);