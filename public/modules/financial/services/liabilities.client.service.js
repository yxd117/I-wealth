'use strict';

angular.module('financial').factory('LiabilitiesService', ['$resource', function($resource){
	var shortTermCredit = {
		creditCard1: {
			description: 'Credit Card 1 Balance',
			order: 0,
			value: 0
		},
		creditCard2: {
			description: 'Credit Card 2 Balance',
			order: 1,
			value: 0
		},
		creditCard3: {
			description: 'Credit Card 3 Balance',
			order: 2,
			value: 0
		},
		overdraftBalance: {
			description: 'Overdraft Balance',
			order: 3,
			value: 0
		},
		others: {
			description: 'Others',
			order: 4,
			value: 0
		}
	};

	var loansMortgages = {
		mortgageBalance: {
			description: 'Mortgage Loan',
			order: 0,
			value: 0,
			minValue: 0
		},
		carBalance :{
			description: 'Car Loan',
			order: 1,
			value: 0,
			minValue: 0
		},
		studentLoan: {
			description: 'Student Loan',
			order: 2,
			value: 0,
			minValue: 0
		},
		personalLoan: {
			description: 'Personal Loan',
			order: 3,
			value: 0,
			minValue: 0
		},
		renovationLoan: {
			description: 'Renovation Loan',
			order: 4,
			value: 0,
			minValue: 0
		},
		others: {
			description: 'Others',
			order: 5,
			value: 0,
			minValue: 0
		}
	};

	var otherLiabilities = {
		others: {
			description: 'Others',
			order: 0,
			value: 0
		}
	};	


	var shortTermCreditAmt = 0;
	var loansMortgagesAmt = 0;
	var otherLiabilitiesAmt = 0;
	var totalAmt = 0;


	var liabilitiesRecords = {		
		shortTermCredit: shortTermCredit,
		loansMortgages: loansMortgages,
		otherLiabilities: otherLiabilities,

		shortTermCreditAmt: shortTermCreditAmt,
		loansMortgagesAmt: loansMortgagesAmt,
		otherLiabilitiesAmt: otherLiabilitiesAmt,
		totalAmt: totalAmt
	};
	return {
		liabilitiesRecords: liabilitiesRecords
	};
}]);