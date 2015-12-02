'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'CreditService', '$location', '$http',
	function($scope, Authentication, CreditService, $location, $http) {
		// This provides Authentication context.
        $scope.authentication = Authentication;

        //Reroute use is not logged in
		$scope.user = Authentication.user;
		if (!$scope.user) $location.path('/');
		
		$scope.rankIcon = './img/rank/diamond0.jpg';




        if($scope.user){
            if(!$scope.user.currentCreditRating){
                $scope.user.currentCreditRating = 0; 
            }

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
            if($scope.user.updatedBudget) score = score + 1;

            $scope.completeBar = Number((score / 8 * 100)).toFixed(2);
            
            $scope.profileCompleteness = false;
            if($scope.user.completeQns && $scope.user.updatedAssets  && $scope.user.updatedLiabilities && $scope.user.updatedIncomeExpense && $scope.user.updatedManageDebt && $scope.user.updatedMilestones && $scope.user.updatedProfileSettings && $scope.user.updatedBudget){
                $scope.profileCompleteness = true;
            }

        }

        //Budget Set up
        var today = new Date();
        var thisMonth = today.getMonth();
        var thisYear = today.getFullYear();

        var budgetLimits = 0;
        if($scope.user) budgetLimits = $scope.user.budgetLimits;

        for (var i = 0; i<budgetLimits.length; i++) {
        	var budgetLimit = budgetLimits[i];
        	if(budgetLimit.month===thisMonth&&budgetLimit.year===thisYear) {
        		$scope.budgetLimit = budgetLimit;				
        	}
        }

        $scope.mth = [];    
        $scope.mth[0] = 'January';
        $scope.mth[1] = 'February';
        $scope.mth[2] = 'March';
        $scope.mth[3] = 'April';
        $scope.mth[4] = 'May';
        $scope.mth[5] = 'June';
        $scope.mth[6] = 'July';
        $scope.mth[7] = 'August';
        $scope.mth[8] = 'September';
        $scope.mth[9] = 'October';
        $scope.mth[10] = 'November';
        $scope.mth[11] = 'December';
        $scope.monthString = $scope.mth[thisMonth];
        $scope.thisYear = thisYear;

        var standingCheck = function (actual, budget) {
            if (actual<= budget) {                
                return true;
                
            } else {                
                return false;
            }
        };

        var progressInfo = function(value) {
            var type;
            if (value < 25) {
              type = 'success';
            } else if (value < 50) {
              type = 'info';
            } else if (value < 75) {
              type = 'warning';
            } else {
              type = 'danger';
            }
            return type; 
        };        

        $scope.feStatus = true;
        $scope.tStatus = true;
        $scope.fStatus = true;
        $scope.uStatus = true;
        $scope.mStatus = true;

        $scope.feBudgetSet = false;
        $scope.tBudgetSet = false;
        $scope.fBudgetSet = false;
        $scope.mBudgetSet = false;
        $scope.uBudgetSet = false;
        $scope.allBudgetSet = false;

        $scope.displayThisMonthFixedExpenseTotal = 0;
        $scope.displayThisMonthTransportTotal = 0;
        $scope.displayThisMonthFoodTotal = 0;
        $scope.displayThisMonthUtilitiesTotal = 0;
        $scope.displayThisMonthMiscTotal = 0;


        if (typeof $scope.budgetLimit !== 'undefined') {
        	if ($scope.budgetLimit.fixedExpenseB!==0 ) {
                $scope.feBudgetSet = true;
            }
            if ($scope.budgetLimit.transportB!==0) {
                $scope.tBudgetSet = true;   
            }
            if ($scope.budgetLimit.foodB!==0) {
                $scope.fBudgetSet = true;
            }
            if ($scope.budgetLimit.miscB!==0) {
                $scope.mBudgetSet = true;
            }
            if ($scope.budgetLimit.utilitiesB!==0) {
                $scope.uBudgetSet = true;
            }

            for(var ii=0;ii<$scope.user.incomeExpenseRecords.length; ii++) {            
                var record = $scope.user.incomeExpenseRecords[ii];
                
                if (record.month===thisMonth&&record.year===thisYear) {
                                                         
                    //Load Fixed Expense Table
                    var fixedExpenseArr = record.monthlyExpense.fixedExpense;
                    $scope.thisMonthFixedExpenseTotal = record.fixedExpenseAmt;
                    $scope.displayThisMonthFixedExpenseTotal = Number(record.fixedExpenseAmt);

                    var  valueE = ($scope.thisMonthFixedExpenseTotal/$scope.budgetLimit.fixedExpenseB)*100;                    
                    var typeE = progressInfo(valueE);                   
                    $scope.dynamicE = Math.floor(valueE);
                    $scope.typeE = typeE;
                    $scope.feStatus = standingCheck($scope.thisMonthFixedExpenseTotal,$scope.budgetLimit.fixedExpenseB);                 
                    $scope.displayFeExceed = ($scope.displayThisMonthFixedExpenseTotal-$scope.budgetLimit.fixedExpenseB);
                    
                    //Load Transport Expense Table
                    var transportArr = record.monthlyExpense.transport;                    
                    $scope.thisMonthTransportTotal = record.transportAmt;                    
                    $scope.displayThisMonthTransportTotal = Number(record.transportAmt);

                    var valueT = ($scope.thisMonthTransportTotal/$scope.budgetLimit.transportB)*100;
                    var typeT = progressInfo(valueT);
                    $scope.dynamicT = Math.floor(valueT);                    
                    $scope.typeT =typeT;
                    $scope.tStatus = standingCheck($scope.thisMonthTransportTotal,$scope.budgetLimit.transportB);
                    $scope.displayTExceed = ($scope.displayThisMonthTransportTotal-$scope.budgetLimit.transportB).toFixed(2);
                    
                    //Load Food Expense Table
                    var foodArr = record.monthlyExpense.foodNecessities;
                    $scope.thisMonthFoodTotal = record.foodNecessitiesAmt;
                    $scope.displayThisMonthFoodTotal = Number(record.foodNecessitiesAmt);

                    var valueF = ($scope.thisMonthFoodTotal/$scope.budgetLimit.foodB)*100;
                    var typeF = progressInfo(valueF);
                    $scope.dynamicF = Math.floor(valueF);
                    $scope.typeF =typeF;
                    $scope.fStatus = standingCheck($scope.thisMonthFoodTotal,$scope.budgetLimit.foodB);
                    $scope.displayFExceed = ($scope.displayThisMonthFoodTotal-$scope.budgetLimit.foodB).toFixed(2);

                    //Load Utilities Expense Table
                    var utilitiesArr = record.monthlyExpense.utilityHousehold;
                    $scope.thisMonthUtilitiesTotal = record.utilityHouseholdAmt;
                    $scope.displayThisMonthUtilitiesTotal = Number(record.utilityHouseholdAmt);

                    var valueU = ($scope.thisMonthUtilitiesTotal/$scope.budgetLimit.utilitiesB)*100;
                    var typeU = progressInfo(valueU);
                    $scope.dynamicU = Math.floor(valueU);
                    $scope.typeU =typeU;
                    $scope.uStatus = standingCheck($scope.thisMonthUtilitiesTotal,$scope.budgetLimit.utilitiesB);
                    $scope.displayUExceed = ($scope.displayThisMonthUtilitiesTotal-$scope.budgetLimit.utilitiesB).toFixed(2);

                    //Load Misc Expense Table
                    var miscArr = record.monthlyExpense.misc;
                    $scope.thisMonthMiscTotal = record.miscAmt;
                    $scope.displayThisMonthMiscTotal = Number(record.miscAmt);

                    var valueM = ($scope.thisMonthMiscTotal/$scope.budgetLimit.miscB)*100;
                    var typeM = progressInfo(valueM);
                    $scope.dynamicM = Math.floor(valueM);
                    $scope.typeM =typeM;
                    $scope.mStatus = standingCheck($scope.thisMonthMiscTotal,$scope.budgetLimit.miscB);
                    $scope.displayMExceed = ($scope.displayThisMonthMiscTotal-$scope.budgetLimit.miscB).toFixed(2);
                }            
            }       
        }
		$scope.decachedAdvUrl = false;

		var getLatestAdv = function(){
            var advImageUrl = 'https://hexapic.s3.amazonaws.com/assets/';
            
			$http.get('/admin/retrieveCurrentAd').success(function(response){
                if(response.length === 0) $scope.adHidden = false;
                $scope.decachedImageUrl = advImageUrl + response.name + '?decache=' + Math.random();

			}).error(function(){

			});
		};

		getLatestAdv();
		$scope.adHidden = true;
	}
]);