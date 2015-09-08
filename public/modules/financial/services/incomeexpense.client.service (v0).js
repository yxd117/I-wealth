'use strict';

angular.module('financial').factory('IncomeExpenseService', ['$resource', function($resource){
	//Income
	var incomeNormal = {
		employmentIncome: {
			description: 'Employment Income',
			order: 0,
			value: 0
		},
		tbpvIncome: {
			description: 'Trade, Business, Profession or Vocation',
			order: 1,
			value: 0
		}
	};

	var otherIncome = {
		dividends: {
			description: 'Dividends',
			order: 0,
			value: 0
		},
		interest: {
			description: 'Interest',
			order: 1,
			value: 0
		},
		rentFromProperty: {
			description: 'Rent from Property',
			order: 2,
			value: 0
		},
		royaltyChargeEstate: {
			description: 'Royalty, Charge, Estate/Trust Income',
			order: 3,
			value: 0
		},
		gainsProfitsIncome: {
			description: 'Gains or Profits of an Income Nature',
			order: 4,
			value: 0
		},
		others: {
			description: 'Others',
			order: 5,
			value: 0
		}
	};

	//Expense
	var fixedExpense = {
		savings: {
			description: 'Savings',
			order: 0,
			value: 0
		},
		mortgageRepayments: {
			description: 'Mortgage Repayments',
			order: 1,
			value: 0
		},
		rentalRepayments: {
			description: 'Rental Repayments',
			order: 2,
			value: 0
		},
		otherLoanRepayments: {
			description: 'Other Loan Repayments',
			order: 3,
			value: 0
		},
		conservancyPropertyTaxes: {
			description: 'Conservancy and Property Taxes',
			order: 4,
			value: 0
		},
		insurances: {
			description: 'Insurances',
			order: 5,
			value: 0
		},
		childrenEducation: {
			description: 'Children&quot Education',
			order: 6,
			value: 0
		},
		allowances: {
			description: 'Allowances for parents & Children',
			order: 7,
			value: 0
		},
		maid: {
			description: 'Maid',
			order: 8,
			value: 0
		},
		others: {
			description: 'Others',
			order: 9,
			value: 0
		}
	};	

	var transport = {
		carLoanRepayment: {
			description: 'Car Loan Repayments',
			order: 0,
			value: 0
		},
		motorInsurances: {
			description: 'Motor Insurances',
			order: 1,
			value: 0
		},
		roadTax: {
			description: 'Road Tax',
			order: 2,
			value: 0
		},
		carparkFees: {
			description: 'Carpark Fees',
			order: 3,
			value: 0
		},
		petrolMaintenanceExpense: {
			description: 'Petrol & Maintenance Expenses',
			order: 4,
			value: 0
		},
		publicTransport: {
			description: 'Public Transport',
			order: 5,
			value: 0
		},
		others: {
			description: 'Others',
			order: 6,
			value: 0
		}
	};	

	var utilityHousehold = {
		utilityBill: {
			description: 'Utilities Bill',
			order: 0,
			value: 0
		},
		homeTelephone: {
			description: 'Home Telephone',
			order: 1,
			value: 0
		},
		mobilePhone: {
			description: 'Mobile Phone',
			order: 2,
			value: 0
		},
		cableTVInternet: {
			description: 'Cable TV & Internet',
			order: 3,
			value: 0
		},
		others: {
			description: 'Others',
			order: 4,
			value: 0
		}
	};

	var foodNecessities = {
		groceries: {
			description: 'Groceries',
			order: 0,
			value: 0
		},
		eatingOut: {
			description: 'Eating Out',
			order: 1,
			value: 0
		},
		clothings: {
			description: 'Clothings',
			order: 2,
			value: 0
		},
		personalGrooming: {
			description: 'Personal Grooming',
			order: 3,
			value: 0
		},
		healthMedical: {
			description: 'Health & Medical',
			order: 4,
			value: 0
		},
		others: {
			description: 'Others',
			order: 5,
			value: 0
		}
	};

	var misc = {
		tourFamilyOutings: {
			description: 'Tour & Family Outings',
			order: 0,
			value: 0
		},
		entertainment: {
			description: 'Entertainment',
			order: 1,
			value: 0
		},
		hobbiesSports: {
			description: 'Hobbies & Sports',
			order: 2,
			value: 0
		},
		others: {
			description: 'Others',
			order: 3,
			value: 0
		}
	};

	var monthlyIncome = {
		incomeNormal: incomeNormal,
		otherIncome: otherIncome
	};

	var monthlyExpense =  {
		fixedExpense: fixedExpense,
		transport: transport,
		utilityHousehold: utilityHousehold,
		foodNecessities: foodNecessities,
		misc: misc
	};

	var incomeNormalAmt = 0;
	var otherIncomeAmt = 0;

	var fixedExpenseAmt = 0;
	var transportAmt = 0;
	var utilityHouseholdAmt = 0;
	var foodNecessitiesAmt = 0;
	var miscAmt = 0;

	var monthlyIncomeAmt = 0;
	var monthlyExpenseAmt = 0;
	var netCashFlow = 0;

	var incomeExpenseRecords = {		
		monthlyIncome: monthlyIncome,
		monthlyExpense: monthlyExpense,

		incomeNormalAmt: incomeNormalAmt,
		otherIncomeAmt: otherIncomeAmt,

		fixedExpenseAmt: fixedExpenseAmt,
		transportAmt: transportAmt,
		utilityHouseholdAmt: utilityHouseholdAmt,
		foodNecessitiesAmt: foodNecessitiesAmt,
		miscAmt: miscAmt,

		monthlyIncomeAmt: monthlyIncomeAmt,
		monthlyExpenseAmt: monthlyExpenseAmt,
		netCashFlow: netCashFlow
	};
	return {
		incomeExpenseRecords: incomeExpenseRecords
	};
}]);