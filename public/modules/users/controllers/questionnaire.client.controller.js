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

		$scope.qnsPersonal = QuestionnaireService.qnsPersonal();
		$scope.qnsJob = QuestionnaireService.qnsJob();
		$scope.qnsFinance = QuestionnaireService.qnsFinance();

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
			if(user.sGender === null || user.sGender === undefined) completePersonalQns = false;
			else {
				personalScore += Number(user.sGender);
				if(Number(user.sGender) === 1){
					user.gender = 'Male';
				} else user.gender = 'Female';
			}

			if(user.sAge === null || user.sAge === undefined) completePersonalQns = false;
			else personalScore += Number(user.sAge);

			if(user.sEducationLevel === null || user.sEducationLevel === undefined) completePersonalQns = false;
			else {
				personalScore += Number(user.sEducationLevel);
				if(Number(user.sEducationLevel) === 5){
					user.educationLevel = 'PhD';
				} else if(Number(user.sEducationLevel) === 4) {
					user.educationLevel = 'Masters';
				} else if (Number(user.sEducationLevel) === 3) {
					user.educationLevel = 'Graduate';
				} else if (Number(user.sEducationLevel) === 2) {
					user.educationLevel = 'Undergraduate';
				} else if (Number(user.sEducationLevel) === 1){
					user.educationLevel = 'A/O/N Levels';
				} else user.educationLevel = 'PSLE';
			}

			if(user.sMaritalStatus === null || user.sMaritalStatus === undefined) completePersonalQns = false;
			else {
				personalScore += Number(user.sMaritalStatus);		
				if(Number(user.sMaritalStatus) === 3) user.maritalStatus = 'Married';
			}

			if(user.sLocativeSituation === null || user.sLocativeSituation === undefined) completePersonalQns = false;
			else personalScore += Number(user.sLocativeSituation);	

			if(user.sLocativeType === null || user.sLocativeType === undefined) completePersonalQns = false;
			else personalScore += Number(user.sLocativeType);

			if(user.sNoOfDependents === null || user.sNoOfDependents === undefined) completePersonalQns = false;
			else {
				personalScore += Number(user.sNoOfDependents);
				if (Number(user.sNoOfDependents) === 3){
					user.noOfDependents = 0;
				} else if (Number(user.sNoOfDependents) === 2){
					user.noOfDependents = 1;
				} else if (Number(user.sNoOfDependents) === 1){
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
			if(user.sCurrentOccupation === null || user.sCurrentOccupation === undefined) completeJobQns = false;
			else {
				jobScore += Number(user.sCurrentOccupation);
				if(Number(user.sCurrentOccupation) === 3){
					user.currentOccupation = 'Salaried Employee';
				} else if (Number(user.sCurrentOccupation) === 2){
					user.currentOccupation = 'Businessman/Self-employed';
				} else if (Number(user.sCurrentOccupation) === 1){
					user.currentOccupation = 'Student';
				}else user.currentOccupation = 'Unemployed';
			}

			if(user.sCurrentWorkPeriod === null || user.sCurrentWorkPeriod === undefined) completeJobQns = false;
			else jobScore += Number(user.sCurrentWorkPeriod);
			if(user.sLastWorkPeriod === null || user.sLastWorkPeriod === undefined) completeJobQns = false;
			else jobScore += Number(user.sLastWorkPeriod);	

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
			if(user.sMonthlyIncome === null || user.sMonthlyIncome === undefined) completeFinanceQns = false;
			else financeScore += Number(user.sMonthlyIncome);
			if(user.sMonthlyExpense === null || user.sMonthlyExpense === undefined) completeFinanceQns = false;
			else financeScore += Number(user.sMonthlyExpense);
			if(user.sMonthlySavings === null || user.sMonthlySavings === undefined) completeFinanceQns = false;
			else financeScore += Number(user.sMonthlySavings);
			if(user.sCreditHistory === null || user.sCreditHistory === undefined) completeFinanceQns = false;
			else financeScore += Number(user.sCreditHistory);		
			if(user.sBankruptStatus === null || user.sBankruptStatus === undefined) completeFinanceQns = false;
			else financeScore += Number(user.sBankruptStatus);	
			if(user.sNumberOfCreditCards === null || user.sNumberOfCreditCards === undefined) completeFinanceQns = false;
			else financeScore += Number(user.sNumberOfCreditCards);	

			user.completeFinanceQns = completeFinanceQns;
			user.financeRating = financeScore;
			return {
				completeFinanceQns: completeFinanceQns,
				financeScore: financeScore
			};
		};
		
	}
]);