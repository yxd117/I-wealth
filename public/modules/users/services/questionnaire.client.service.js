'use strict';

// Authentication service for user variables
angular.module('users').factory('QuestionnaireService', ['$resource', function($resource){
	var qnsPersonal = [
		{
			qnID: 'gender',
			qnModel: 'user.creditProfileScore.sGender', // TO update 
			content: 'What is your Gender?',
			options: ['Male', 'Female'],
			rating: {
				'Male': 1,
				'Female': 0
			}
		},
		{
			qnID: 'age',
			qnModel: 'user.creditProfileScore.sAge',
			content: 'What is your Age?',
			options: ['Between 20 and 30 years', 'Between 30 and 40 years', 'Between 40 and 50 years', 'Between 50 and 60 years', 'Above 60 years'],
			rating: {
				'Between 20 and 30 years': 4,
				'Between 30 and 40 years': 3,
				'Between 40 and 50 years': 2,
				'Between 50 and 60 years': 1,
				'Above 60 years': 0
			}

		},
		{
			qnID: 'educationLevel',
			qnModel: 'user.creditProfileScore.sEducationLevel', // To Update
			content: 'What is your Highest Education Level?',
			options: ['PhD', 'Masters', 'Graduate', 'Undergraduate', 'A/O/N Levels', 'PSLE & Below'],
			rating: {
				'PhD': 5,
				'Masters': 4,
				'Graduate': 3,
				'Undergraduate': 2,
				'A/O/N Levels': 1,
				'PSLE': 0
			}

		},
		{
			qnID: 'maritalStatus',
			qnModel: 'user.creditProfileScore.sMaritalStatus', //To Update
			content: 'What is your Marital Status?',
			options: ['Married', 'Single/Divorced/Widowed'],
			rating: {
				'Married': 3,
				'Single/Divorced/Widowed': 1
			}

		},
		{
			qnID: 'locativeType',
			qnModel: 'user.creditProfileScore.sLocativeType',
			content: 'What is your highest value housing that you currently own?',
			options: ['Landed Property', 'Condo/Private Apartments', 'HDB Executive Flats/ HUDC Flats/ Studio Apartments', 'HDB (Others)', 'Shop houses/ other housing units', 'N/A'],
			rating: {
				'Landed Property': 5,
				'Condo/Private Apartments': 4,
				'HDB Executive Flats/ HUDC Flats/ Studio Apartments': 3,
				'HDB (Others)': 2, 
				'Shop houses/ other housing units': 1,
				'N/A': 0
			}

		},
		{
			qnID: 'locativeSituation',
			qnModel: 'user.creditProfileScore.sLocativeSituation',
			content: 'What is your current ownership status?',
			options: ['Own house', 'Personal apartment', 'Parents apartment', 'Rent'],
			rating: {
				'Own house': 3,
				'Personal apartment': 2,
				'Parents apartment': 1,
				'Rent': 0
			}

		},
		{
			qnID: 'noOfDependents',
			qnModel: 'user.creditProfileScore.sNoOfDependents', //To Update
			content: 'How many Dependents do you have?',
			options: ['0 person', '1 person', '2 persons', '3 or more persons'],
			rating: {
				'0 person': 3,
				'1 person': 2,
				'2 persons': 1,
				'3 or more persons': 0
			}

		}
	];

	var qnsJob = [
		{
			qnID: 'currentOccupation',
			qnModel: 'user.creditProfileScore.sCurrentOccupation', //To Update
			content: 'What is your current occupation?',
			options: ['Salaried Employee', 'Businessman/Self-employed', 'Student', 'Unemployed'],
			rating: {
				'Salaried Employee': 3,
				'Businessman/Self-employed': 2,
				'Student': 1,
				'Unemployed': 0
			}
		},
		{
			qnID: 'currentWorkPeriod',
			qnModel: 'user.creditProfileScore.sCurrentWorkPeriod', 
			content: 'How long have you been with your current employer?',
			options: ['Greater than 5 years', 'Between 2 and 5 years', 'Between 1 and 2 years', 'Retired', 'NA'],
			rating: {
				'Greater than 5 years': 4,
				'Between 2 and 5 years': 3,
				'Between 1 and 2 years': 2,
				'Retired': 1,
				'NA': 0
			}

		},
		{
			qnID: 'lastWorkPeriod',
			qnModel: 'user.creditProfileScore.sLastWorkPeriod',
			content: 'How long have you been with your previous employer?',
			options: ['Greater than 5 years', 'Between 2 and 5 years', 'Between 1 and 2 years', 'Retired', 'NA'],
			rating: {
				'Greater than 5 years': 4,
				'Between 2 and 5 years': 3,
				'Between 1 and 2 years': 2,
				'Retired': 1,
				'NA': 0
			}

		}
	];

	var qnsFinance = [
		{
			qnID: 'monthlyIncome',
			qnModel: 'user.creditProfileScore.sMonthlyIncome',
			content: 'What is your average monthly Net Income?',
			options: ['Above $10,000', 'Between $8,000 and $10,000', 'Between $6,000 and $8,000', 'Between $4,000 and $6,000', 'Between $1,000 and $4,000', 'Less than $1,000', 'NA'],
			rating: {
				'Above $10,000': 6,
				'Between $8,000 and $10,000': 5,
				'Between $6,000 and $8,000': 4,
				'Between $4,000 and $6,000': 3,
				'Between $1,000 and $4,000': 2,
				'Less than $1,000': 1,
				'NA': 0
			}
		},
		{
			qnID: 'monthlyExpense',
			qnModel: 'user.creditProfileScore.sMonthlyExpense',
			content: 'What is your average monthly expenditure?',
			options: ['Above $10,000', 'Between $8,000 and $10,000', 'Between $6,000 and $8,000', 'Between $4,000 and $6,000', 'Between $1,000 and $4,000', 'Less than $1,000', 'NA'],
			rating: {
				'Above $10,000': 6,
				'Between $8,000 and $10,000': 5,
				'Between $6,000 and $8,000': 4,
				'Between $4,000 and $6,000': 3,
				'Between $1,000 and $4,000': 2,
				'Less than $1,000': 1,
				'NA': 0
			}

		},
		{
			qnID: 'monthlySavings',
			qnModel: 'user.creditProfileScore.sMonthlySavings',
			content: 'What is your average monthly savings?',
			options: ['Above $10,000', 'Between $8,000 and $10,000', 'Between $6,000 and $8,000', 'Between $4,000 and $6,000', 'Between $1,000 and $4,000', 'Less than $1,000', 'NA'],
			rating: {
				'Above $10,000': 6,
				'Between $8,000 and $10,000': 5,
				'Between $6,000 and $8,000': 4,
				'Between $4,000 and $6,000': 3,
				'Between $1,000 and $4,000': 2,
				'Less than $1,000': 1,
				'NA': 0
			}

		},
		{
			qnID: 'creditHistory',
			qnModel: 'user.creditProfileScore.sCreditHistory',
			content: 'Have you had any history of credit default?',
			options: ['90 days default', '60 days default', '30 days default', 'NA'],
			rating: {
				'90 days default': 1,
				'60 days default': 2,
				'30 days default': 3,
				'NA': 4
			}

		},
		{
			qnID: 'bankruptStatus',
			qnModel: 'user.creditProfileScore.sBankruptStatus',
			content: 'Have you been bankrupt in the last 6 years?',
			options: ['Yes', 'No'],
			rating: {
				'Yes': 0,
				'No': 4,
			}

		},
		{
			qnID: 'numberOfCreditCards',
			qnModel: 'user.creditProfileScore.sNumberOfCreditCards',
			content: 'How many credit cards do you own?',
			options: ['5 or more', '3 - 4', '2', '1', '0'],
			rating: {
				'5 or more': 4,
				'3 - 4': 3,
				'2': 2,
				'1': 1,
				'0': 0
			}

		}
	];

	var creditProfileScore = {
		sGender: 0,
		sAge: 0,
		sEducationLevel: 0,
		sMaritalStatus: 0,
		sLocativeType: 0,
		sLocativeSituation: 0,
		sNoOfDependents: 0,
		sCurrentOccupation: 0,
		sCurrentWorkPeriod: 0,
		sLastWorkPeriod: 0,
		sMonthlyIncome: 0,
		sMonthlyExpense: 0,
		sMonthlySavings: 0,
		sCreditHistory: 0,
		sBankruptStatus: 0,
		sNumberOfCreditCards: 0
	};

	return {
		qnsPersonal: qnsPersonal,
		qnsJob: qnsJob,
		qnsFinance: qnsFinance,
		creditProfileScore: creditProfileScore
	};
}]);