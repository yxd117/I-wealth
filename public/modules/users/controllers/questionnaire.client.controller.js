'use strict';

angular.module('users').controller('QuestionnaireController', ['$scope', '$stateParams', '$http', '$location', 'Users', 'Authentication', 'QuestionnaireService', 'CreditService',
	function($scope, $stateParams, $http, $location, Users, Authentication, QuestionnaireService, CreditService) {
		$scope.authentication = Authentication;
		$scope.user = Authentication.user;	
		//Check for authentication
		if (!$scope.user) $location.path('/');
		this.$setScope = function(context) {
     		$scope = context;
		};
		//Questions
		$scope.oneAtATime = false;

		$scope.qnsPersonal = QuestionnaireService.qnsPersonal;
		$scope.qnsJob = QuestionnaireService.qnsJob;
		$scope.qnsFinance = QuestionnaireService.qnsFinance;

		$scope.clearSuccessMessage = function() {
			$scope.success = false;
			$scope.error = '';
		};
		$scope.addItem = function() {
		    var newItemNo = $scope.items.length + 1;
		    $scope.items.push('Item ' + newItemNo);
		};

		$scope.status = {
		    isFirstOpen: true,
		    isFirstDisabled: false
		};

		$scope.questions = [];

		
		$scope.updateUserQns = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);
				verifyAllQnsCompleted(user);
				user.$update(function(response) {
					$scope.success = true;
					
					Authentication.user = response;
					$scope.user = Authentication.user;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}	
		};

		var verifyAllQnsCompleted = function(user){
			var personalRes = verifyQnsPersonalCompleted(user);
			var jobRes = verifyQnsJobCompleted(user);
			var financeRes = verifyQnsFinanceCompleted(user);

			if(personalRes.completePersonalQns === true && jobRes.completeJobQns === true && financeRes.completeFinanceQns === true) user.completeQns = true;
			user.currentCreditRating = personalRes.personalScore + jobRes.jobScore + financeRes.financeScore;

			user.creditGrade = CreditService.creditGrade(user.currentCreditRating);


		};

			/*
			user.completeQns = completePersonalQns;
			user.currentCreditRating = personalScore;
			*/		
		var verifyQnsPersonalCompleted = function(user){
			var completePersonalQns = true;
			var personalScore = 0;

			if(user.creditProfileScore.sGender === null || user.creditProfileScore.sGender === undefined) completePersonalQns = false;
			else {
				personalScore += Number(user.creditProfileScore.sGender);
				if(Number(user.creditProfileScore.sGender) === 1){
					user.gender = 'Male';
				} else user.gender = 'Female';
			}
			
			if(user.creditProfileScore.sAge === null || user.creditProfileScore.sAge === undefined) completePersonalQns = false;
			else personalScore += Number(user.creditProfileScore.sAge);

			if(user.creditProfileScore.sEducationLevel === null || user.creditProfileScore.sEducationLevel === undefined) completePersonalQns = false;
			else {
				personalScore += Number(user.creditProfileScore.sEducationLevel);
				if(Number(user.creditProfileScore.sEducationLevel) === 5){
					user.educationLevel = 'PhD';
				} else if(Number(user.creditProfileScore.sEducationLevel) === 4) {
					user.educationLevel = 'Masters';
				} else if (Number(user.creditProfileScore.sEducationLevel) === 3) {
					user.educationLevel = 'Graduate';
				} else if (Number(user.creditProfileScore.sEducationLevel) === 2) {
					user.educationLevel = 'Undergraduate';
				} else if (Number(user.creditProfileScore.sEducationLevel) === 1){
					user.educationLevel = 'A/O/N Levels';
				} else user.educationLevel = 'PSLE';
			}
			
			if(user.creditProfileScore.sMaritalStatus === null || user.creditProfileScore.sMaritalStatus === undefined) completePersonalQns = false;
			else {
				personalScore += Number(user.creditProfileScore.sMaritalStatus);		
				if(Number(user.creditProfileScore.sMaritalStatus) === 3) user.maritalStatus = 'Married';
			}
			
			if(user.creditProfileScore.sLocativeSituation === null || user.creditProfileScore.sLocativeSituation === undefined) completePersonalQns = false;
			else personalScore += Number(user.creditProfileScore.sLocativeSituation);	

			if(user.creditProfileScore.sLocativeType === null || user.creditProfileScore.sLocativeType === undefined) completePersonalQns = false;
			else personalScore += Number(user.creditProfileScore.sLocativeType);
			console.log(personalScore);

			if(user.creditProfileScore.sNoOfDependents === null || user.creditProfileScore.sNoOfDependents === undefined) completePersonalQns = false;
			else {
				personalScore += Number(user.creditProfileScore.sNoOfDependents);
				if (Number(user.creditProfileScore.sNoOfDependents) === 3){
					user.noOfDependents = 0;
				} else if (Number(user.creditProfileScore.sNoOfDependents) === 2){
					user.noOfDependents = 1;
				} else if (Number(user.creditProfileScore.sNoOfDependents) === 1){
					user.noOfDependents = 2;
				}
			}	

			user.completePersonalQns = completePersonalQns;
			user.personalRating = personalScore;
			return {
				completePersonalQns: completePersonalQns,
				personalScore: personalScore
			};
		};

		var verifyQnsJobCompleted = function(user){
			var completeJobQns = true;
			var jobScore = 0;
			if(user.creditProfileScore.sCurrentOccupation === null || user.creditProfileScore.sCurrentOccupation === undefined) completeJobQns = false;
			else {
				jobScore += Number(user.creditProfileScore.sCurrentOccupation);
				if(Number(user.creditProfileScore.sCurrentOccupation) === 3){
					user.currentOccupation = 'Salaried Employee';
				} else if (Number(user.creditProfileScore.sCurrentOccupation) === 2){
					user.currentOccupation = 'Businessman/Self-employed';
				} else if (Number(user.creditProfileScore.sCurrentOccupation) === 1){
					user.currentOccupation = 'Student';
				}else user.currentOccupation = 'Unemployed';
			}

			if(user.creditProfileScore.sCurrentWorkPeriod === null || user.creditProfileScore.sCurrentWorkPeriod === undefined) completeJobQns = false;
			else jobScore += Number(user.creditProfileScore.sCurrentWorkPeriod);
			if(user.creditProfileScore.sLastWorkPeriod === null || user.creditProfileScore.sLastWorkPeriod === undefined) completeJobQns = false;
			else jobScore += Number(user.creditProfileScore.sLastWorkPeriod);	

			user.completeJobQns = completeJobQns;
			user.jobRating = jobScore;
			return {
				completeJobQns: completeJobQns,
				jobScore: jobScore
			};
		};

		var verifyQnsFinanceCompleted = function(user){
			var completeFinanceQns = true;
			var financeScore = 0;
			if(user.creditProfileScore.sMonthlyIncome === null || user.creditProfileScore.sMonthlyIncome === undefined) completeFinanceQns = false;
			else financeScore += Number(user.creditProfileScore.sMonthlyIncome);
			if(user.creditProfileScore.sMonthlyExpense === null || user.creditProfileScore.sMonthlyExpense === undefined) completeFinanceQns = false;
			else financeScore += Number(user.creditProfileScore.sMonthlyExpense);
			if(user.creditProfileScore.sMonthlySavings === null || user.creditProfileScore.sMonthlySavings === undefined) completeFinanceQns = false;
			else financeScore += Number(user.creditProfileScore.sMonthlySavings);
			if(user.creditProfileScore.sCreditHistory === null || user.creditProfileScore.sCreditHistory === undefined) completeFinanceQns = false;
			else financeScore += Number(user.creditProfileScore.sCreditHistory);		
			if(user.creditProfileScore.sBankruptStatus === null || user.creditProfileScore.sBankruptStatus === undefined) completeFinanceQns = false;
			else financeScore += Number(user.creditProfileScore.sBankruptStatus);	
			if(user.creditProfileScore.sNumberOfCreditCards === null || user.creditProfileScore.sNumberOfCreditCards === undefined) completeFinanceQns = false;
			else financeScore += Number(user.creditProfileScore.sNumberOfCreditCards);	

			user.completeFinanceQns = completeFinanceQns;
			user.financeRating = financeScore;
			return {
				completeFinanceQns: completeFinanceQns,
				financeScore: financeScore
			};
		};
		
	}
]);