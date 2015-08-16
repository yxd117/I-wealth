'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('landing', {
			url: '/',
			templateUrl: 'modules/core/views/landing.client.view.html'
		}).
		state('home', {
			url: '/home',
			templateUrl: 'modules/core/views/home.client.view.html'
		}).


		state('financialhealth', {
			url: '/financialhealth',
			templateUrl: 'modules/financial/views/financialhealth.client.view.html'
		}).

		state('financial', {
			url: '/financialrecord',
			templateUrl: 'modules/financial/views/overview.client.view.html'
		}).

		state('manageAssets', {
			url: '/financialrecord/assets',
			templateUrl: 'modules/financial/views/manage-assets.client.view.html'
		}).
		state('manageLiabilities', {
			url: '/financialrecord/liabilities',
			templateUrl: 'modules/financial/views/manage-liabilities.client.view.html'
		}).
		state('manageIncomeExpense', {
			url: '/financialrecord/incomeExpense',
			templateUrl: 'modules/financial/views/manage-incomeExpense.client.view.html'
		}).
		state('manageDebts', {
			url: '/financialrecord/debts',
			templateUrl: 'modules/financial/views/manage-debts.client.view.html'
		}).

		//Financial Tools
		state('repaymentTool', {
			url: '/financialtools/loancalculator',
			templateUrl: 'modules/financialtools/views/repaymentCalculator.client.view.html'
		}).		
		state('amtBorrow', {
			url: '/financialtools/amtborrow',
			templateUrl: 'modules/financialtools/views/amtToBorrowCalculator.client.view.html'
		}).
		state('timeRepay', {
			url: '/financialtools/timetorepay',
			templateUrl: 'modules/financialtools/views/timeToRepayCalculator.client.view.html'
		}).

		//Milestones
		state('milestones', {
			url: '/milestones',
			templateUrl: 'modules/milestones/views/view-milestones.client.view.html'
		}).
		
		state('updateMilestone', {
			url:'/milestones/updatemilestone',
			templateUrl: 'modules/milestones/views/update-Milestone.client.view.html'
		}).


		// state('milestones', {
		// 	url: '/milestones',
		// 	templateUrl: 'modules/milestones/views/milestones.client.view.html'
		// }).
		// state('shortTermMilestones',{
		// 	url: '/milestones/shortterm',
		// 	templateUrl: 'modules/milestones/views/short-term.client.view.html'
		// }).
		// state('longTermMilestones',{
		// 	url: '/milestones/longterm',
		// 	templateUrl: 'modules/milestones/views/long-term.client.view.html'
		// }).


		// state('manageFriend',{
		// 	url: '/social/managefriends',
		// 	templateUrl: 'modules/social/views/manage-friends.client.view.html'
		// }).
		state('forum',{
			url: '/social',
			templateUrl: 'modules/social/views/social.client.view.html'
		});

	}
]);