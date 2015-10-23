'use strict';

// Configuring the Articles module
angular.module('core').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Home', 'home', '/home');
		//Menus.addSubMenuItem('topbar', 'creditworthiness', 'view Creditworthiness', 'creditworthiness');
		Menus.addMenuItem('topbar', 'Financial Health', 'financialhealth', '/financialhealth');

		Menus.addMenuItem('topbar', 'Manage Finances', 'financialrecord','/financialrecord');

		Menus.addMenuItem('topbar', 'Budget', 'budget', '/budget');
		// Menus.addSubMenuItem('topbar', 'financial', 'Manage Debt', 'financial/debt');
		// Menus.addSubMenuItem('topbar', 'financial', 'Manage Insurance', 'financial/insurance');
		// Menus.addSubMenuItem('topbar', 'financial', 'Manage Investment', 'financial/investment');
		// Menus.addSubMenuItem('topbar', 'financial', 'Manage Cashflow', 'financial/cashflow');

		Menus.addMenuItem('topbar', 'Milestones', 'milestones', '/milestones');


		Menus.addMenuItem('topbar', 'Financial Tools', 'financialtools', 'dropdown', '/financialtools');
		Menus.addSubMenuItem('topbar', 'financialtools', 'Loan Calculator', 'financialtools/loancalculator');
		Menus.addSubMenuItem('topbar', 'financialtools', 'Retirement Planning Calculator', 'financialtools/retirementCalculator');

		Menus.addMenuItem('topbar', 'Financial Education', 'financialEducation', '/financialEducation');

		Menus.addMenuItem('topbar', 'Social', 'social', 'dropdown','/social');
		Menus.addSubMenuItem('topbar', 'social', 'View Posts', 'social/posts');
		Menus.addSubMenuItem('topbar', 'social', 'Manage Friends', 'social/friends');
		Menus.addSubMenuItem('topbar', 'social', 'Find Users', 'social/users');

	}
]);