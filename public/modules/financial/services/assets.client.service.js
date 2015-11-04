'use strict';

angular.module('financial').factory('AssetsService', ['$resource', function($resource){
	var cashEquivalents = {
		cashOnHand: {
			description: 'Cash on Hand',
			order: 0,
			value: 0
		},
		currentAcc: {
			description: 'Current Account',
			order: 1,
			value: 0
		},
		savingsAcc: {
			description: 'Savings Account',
			order: 2,
			value: 0
		},
		fixedDeposit: {
			description: 'Fixed Deposit',
			order: 3,
			value: 0
		},
		others: {
			description: 'Others',
			order: 4,
			value: 0
		}
	};

	var personalUseAssets = {
		house: {
			description: 'House (Residing)',
			order: 0,
			value: 0
		},
		car: {
			description: 'Car',
			order: 1,
			value: 0
		},
		countryClubs: {
			description: 'Country Clubs',
			order: 2,
			value: 0
		},
		others: {
			description: 'Others',
			order: 3,
			value: 0
		}
	};

	var investedAssets = {
		privateProperties: {
			description: 'Private Properties',
			order: 0,
			value: 0
		},
		shares: {
			description: 'Shares',
			order: 1,
			value: 0
		},
		unitTrusts: {
			description: 'Unit Trusts',
			order: 2,
			value: 0
		},
		corporateBonds: {
			description: 'Corporate Bonds',
			order: 3,
			value: 0
		},
		singaoporeSavingsBonds: {
			description: 'Singapore Savings Bonds',
			order: 4,
			value: 0
		},
		governmentBonds: {
			description: 'Government Bonds',
			order: 5,
			value: 0
		},
		bondFunds: {
			description: 'Bond Funds',
			order: 6,
			value: 0
		},
		bondETFs: {
			description: 'Bond ETFs',
			order: 7,
			value: 0
		},
		lifeInsurance: {
			description: 'Life Insurance',
			order: 8,
			value: 0,
			minValue: 0
		},
		investmentInsurance: {
			description: 'Investment Insurance',
			order: 9,
			value: 0,
			minValue: 0
		},
		others: {
			description: 'Others',
			order: 10,
			value: 0,
			minValue: 0
		}
	};

	var cpfSavings = {
		ordinaryAcc: {
			description: 'Ordinary Account',
			order: 0,
			value: 0
		},
		specialAcc: {
			description: 'Special Account',
			order: 1,
			value: 0
		},
		medisaveAcc: {
			description: 'Medisave Account',
			order: 2,
			value: 0
		},
		others: {
			description: 'Others',
			order: 3,
			value: 0
		}
	};

	var otherAssets = {
		others: {
			description: 'Others',
			order: 0,
			value: 0
		}
	};

	var cashEquivalentsAmt = 0;
	var personalUseAssetsAmt = 0;
	var investedAssetsAmt = 0;
	var cpfSavingsAmt = 0;
	var otherAssetsAmt = 0;
	var totalAmt = 0;

	var assetsRecords = {		
		cashEquivalents: cashEquivalents,
		personalUseAssets: personalUseAssets,
		investedAssets: investedAssets,
		cpfSavings: cpfSavings,
		otherAssets: otherAssets,

		cashEquivalentsAmt: cashEquivalentsAmt,
		personalUseAssetsAmt: personalUseAssetsAmt,
		investedAssetsAmt: investedAssetsAmt,
		cpfSavingsAmt: cpfSavingsAmt,
		otherAssetsAmt: otherAssetsAmt,
		totalAmt: totalAmt
	};
	return {
		assetsRecords: assetsRecords
	};
}]);