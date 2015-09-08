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
			value: 0,
			recordsTotal: 0,
			records: []
		},
		mortgageRepayments: {
			description: 'Mortgage Repayments',
			order: 1,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		rentalRepayments: {
			description: 'Rental Repayments',
			order: 2,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		otherLoanRepayments: {
			description: 'Other Loan Repayments',
			order: 3,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		conservancyPropertyTaxes: {
			description: 'Conservancy and Property Taxes',
			order: 4,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		insurances: {
			description: 'Insurances',
			order: 5,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		childrenEducation: {
			description: 'Children&quot Education',
			order: 6,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		allowances: {
			description: 'Allowances for parents & Children',
			order: 7,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		maid: {
			description: 'Maid',
			order: 8,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		others: {
			description: 'Others',
			order: 9,
			value: 0,
			recordsTotal: 0,
			records: []
		}
	};	

	var transport = {
		carLoanRepayment: {
			description: 'Car Loan Repayments',
			order: 0,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		motorInsurances: {
			description: 'Motor Insurances',
			order: 1,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		roadTax: {
			description: 'Road Tax',
			order: 2,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		carparkFees: {
			description: 'Carpark Fees',
			order: 3,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		petrolMaintenanceExpense: {
			description: 'Petrol & Maintenance Expenses',
			order: 4,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		publicTransport: {
			description: 'Public Transport',
			order: 5,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		others: {
			description: 'Others',
			order: 6,
			value: 0,
			recordsTotal: 0,
			records: []
		}
	};	

	var utilityHousehold = {
		utilityBill: {
			description: 'Utilities Bill',
			order: 0,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		homeTelephone: {
			description: 'Home Telephone',
			order: 1,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		mobilePhone: {
			description: 'Mobile Phone',
			order: 2,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		cableTVInternet: {
			description: 'Cable TV & Internet',
			order: 3,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		others: {
			description: 'Others',
			order: 4,
			value: 0,
			recordsTotal: 0,
			records: []
		}
	};

	var foodNecessities = {
		groceries: {
			description: 'Groceries',
			order: 0,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		eatingOut: {
			description: 'Eating Out',
			order: 1,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		clothings: {
			description: 'Clothings',
			order: 2,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		personalGrooming: {
			description: 'Personal Grooming',
			order: 3,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		healthMedical: {
			description: 'Health & Medical',
			order: 4,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		others: {
			description: 'Others',
			order: 5,
			value: 0,
			recordsTotal: 0,
			records: []
		}
	};

	var misc = {
		tourFamilyOutings: {
			description: 'Tour & Family Outings',
			order: 0,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		entertainment: {
			description: 'Entertainment',
			order: 1,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		hobbiesSports: {
			description: 'Hobbies & Sports',
			order: 2,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		others: {
			description: 'Others',
			order: 3,
			value: 0,
			recordsTotal: 0,
			records: []
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