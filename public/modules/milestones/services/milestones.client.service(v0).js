'use strict';

// Authentication service for user variables
angular.module('milestones').factory('MilestoneService', ['$resource', function($resource){
	var qnsTitle = {
			1:'Name',
			//qnModel: 'user.gender',
			2:'Description'
	};		
	
	var qnsType = {
		1:'Goal Type',
			//qnModel: 'user.age',
		2:'Type of Goal',
		3:'Savings', 
		4:'Retirement', 
		5:'Education'
	};

	var qnsTargetAmount = {
		1:'targetAmount',
		2:'Target Amount to Save'
	};		


	var qnsCurrentAmount = {
		1:'currentAmount',
		2:'Amount Saved Currently'
	};

	var qnsTargetDate = {

		1:'targetDate',
		2:'Target Date'

	};


	return {
		qnsTitle: function(){
			return qnsTitle;
		},
		qnsType: function(){
			return qnsType;
		},
		qnsTargetAmount: function(){
			return qnsTargetAmount;
		},
		qnsCurrentAmount: function(){
			return qnsCurrentAmount;
		},
		qnsTargetDate: function(){
			return qnsTargetDate;
		}
	};

}]);