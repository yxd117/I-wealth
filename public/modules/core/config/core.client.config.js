'use strict';

// Configuring the Articles module
angular.module('core').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Home', 'home', '/home');
		//Menus.addSubMenuItem('topbar', 'creditworthiness', 'view Creditworthiness', 'creditworthiness');
		Menus.addMenuItem('topbar', 'Financial Health', 'financialhealth', '/financialhealth');

		Menus.addMenuItem('topbar', 'Manage Finances', 'financialrecord','/financialrecord');
		// Menus.addSubMenuItem('topbar', 'financial', 'Manage Debt', 'financial/debt');
		// Menus.addSubMenuItem('topbar', 'financial', 'Manage Insurance', 'financial/insurance');
		// Menus.addSubMenuItem('topbar', 'financial', 'Manage Investment', 'financial/investment');
		// Menus.addSubMenuItem('topbar', 'financial', 'Manage Cashflow', 'financial/cashflow');

		Menus.addMenuItem('topbar', 'Milestones', 'milestones', '/milestones');
		// Menus.addSubMenuItem('topbar', 'milestones', 'Short Term', 'milestones/shortterm');
		// Menus.addSubMenuItem('topbar', 'milestones', 'Long Term', 'milestones/longterm');

		Menus.addMenuItem('topbar', 'Social', 'social', '/social');
		// Menus.addSubMenuItem('topbar', 'social', 'Manage Friends', 'social/managefriends');
		// Menus.addSubMenuItem('topbar', 'social', 'Forum', 'social/forum');

	}
]);