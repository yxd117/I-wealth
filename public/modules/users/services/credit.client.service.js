'use strict';

// Authentication service for user variables
angular.module('users').factory('CreditService', function() {
	var analysis = ['N/A', 'Profile not completed'];
	var creditGrade = function(creditRating){
		if(creditRating > 57 && creditRating < 65){
			analysis = ['A', 'Excellent - You have the characteristics of people who show the lowest possible risk and banks considers your credit to be of the highest quality. You show no default risk due to highest credit score. Chances of getting a loan is high.'];
		}else if(creditRating > 47 && creditRating < 58){
			analysis = ['B', 'Good - People with a Grade B credit score shows lowest default risk because of high credit score and have good quality of loan applications. Chances of getting a loan will be above average.'];
		}else if(creditRating > 31 && creditRating < 48){
			analysis = ['C', 'Average - Grade ‘C’ represents medium level of default/ credit risk as having average level of credit score and having an average quality of loan application. Chances of getting a loan will be low.'];
		}else if (creditRating >=0 && creditRating < 32){
			analysis = ['D', 'Below Average - Grade ‘D’ indicates the high level of risk and also having below average credit score. People with this grade will not be qualified for loan by banks.'];
		}
		return analysis;
	};
	
	return {
		creditGrade: creditGrade
	};
});