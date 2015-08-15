'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'CreditService', '$location',
	function($scope, Authentication, CreditService, $location) {
		// This provides Authentication context.
		$scope.user = Authentication.user;
		if (!$scope.user) $location.path('/');
		
		$scope.rankIcon = './img/rank/diamond0.jpg';

		if(!$scope.user.currentCreditRating) $scope.user.currentCreditRating = 'N/A';
		$scope.creditGrade = CreditService.creditGrade($scope.user.currentCreditRating);
		if($scope.creditGrade[0] === 'D'){
			$scope.rankIcon = './img/rank/diamond2.png';
		} else if($scope.creditGrade[0] === 'C'){
			$scope.rankIcon = './img/rank/diamond3.png';
		} else if($scope.creditGrade[0] === 'B'){
			$scope.rankIcon = './img/rank/diamond4.png';
		} else if($scope.creditGrade[0] === 'A'){
			$scope.rankIcon = './img/rank/diamond5.png';
		}

		//Calc completeness
		var score = 0;
		if($scope.user.completeQns) score = score + 1;
		if($scope.user.updatedAssets) score = score + 1;
		if($scope.user.updatedLiabilities) score = score + 1;
		if($scope.user.updatedIncomeExpense) score = score + 1;
		if($scope.user.updatedManageDebt) score = score + 1;
		if($scope.user.updatedMilestones) score = score + 1;
		if($scope.user.updatedProfileSettings) score = score + 1;

		$scope.completeBar = Number((score / 7 * 100)).toFixed(2);
		
		$scope.profileCompleteness = false;
		if($scope.user.completeQns && $scope.user.updatedAssets  && $scope.user.updatedLiabilities && $scope.user.updatedIncomeExpense && $scope.user.updatedManageDebt && $scope.user.updatedMilestones && $scope.user.updatedProfileSettings){
			$scope.profileCompleteness = true;
		}
	}
]);