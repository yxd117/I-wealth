'use strict';

angular.module('financial').factory('BudgetService', ['$resource', function($resource){
	//Income
	var budgetLimits = {
		fixedExpenseB: 0,
		foodB: 0,
		miscB: 0,
		utilitiesB: 0,
		transportB: 0
	};

	return {
		budgetLimits: budgetLimits
	};
}]);