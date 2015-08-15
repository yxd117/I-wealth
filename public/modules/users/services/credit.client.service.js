'use strict';

// Authentication service for user variables
angular.module('users').factory('CreditService', function() {
	var analysis = ['N/A', 'Profile not completed'];
	var creditGrade = function(creditRating){
		if(creditRating > 57 && creditRating < 65){
			analysis = ['A', 'Excellent'];
		}else if(creditRating > 47 && creditRating < 58){
			analysis = ['B', 'Good'];
		}else if(creditRating > 31 && creditRating < 48){
			analysis = ['C', 'Average'];
		}else if (creditRating >=0 && creditRating < 32){
			analysis = ['D', 'Below Average'];
		}
		return analysis;
	};
	
	return {
		creditGrade: creditGrade
	};
});