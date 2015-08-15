'use strict';

// Articles controller
angular.module('financialtools').controller('LoanCalculatorController', ['$scope', '$rootScope', '$stateParams', '$location', 'Authentication', 'Users', '$q', 
	function($scope, $rootScope, $stateParams, $location, Authentication, Users, $q) {
        $scope.user = Authentication.user;

        $scope.monthlyRepaymentSum = 0;
        $scope.totalCostLoan = 0;
        $scope.results = 0;  

        $scope.principalAmtToBorrow = 0;  
        $scope.interestPaid = 0;  

        var year = 0;
        var month = 0;
        var yearMth = 0;
        $scope.timeToRepay = '0 years 0 months';  

        $scope.barSeries = [];  
        $scope.barLabels = [];
        $scope.barData = [];
        var barArr = [];

        $scope.barSeries2 = [];  
        $scope.barLabels2 = [];
        $scope.barData2 = [];
        var barArr2 = [];
 
        $scope.barSeries3 = [];  
        $scope.barLabels3 = [];
        $scope.barData3 = [];
        var barArr3 = [];

       $scope.calculateMonthyRepaymentSum = function() {
          $scope.loanTermMonths = convertLoanTermToMonths();
          $scope.monthlyRepaymentSum = $scope.calculator.amtBorrowed / ((1-(1/Math.pow((1+($scope.calculator.interestRate / 12)), $scope.loanTermMonths))) / ($scope.calculator.interestRate / 12));
          calculateTotalLoan();
        };
 
        var calculateTotalLoan = function() {
          $scope.totalCostLoan = $scope.monthlyRepaymentSum * $scope.loanTermMonths + $scope.calculator.fees;
          calculateResult();
        };

        var convertLoanTermToMonths = function() {
          return $scope.calculator.loanTermYears * 12;
        };

        var calculateResult = function() {
          $scope.results = $scope.totalCostLoan - $scope.calculator.amtBorrowed;
          
          barArr.push($scope.monthlyRepaymentSum);         
          $scope.barSeries.push('Scenario 1');
          $scope.barLabels.push('Monthly Repayment Sum');
          $scope.barData.push(barArr);
        };

       $scope.calculatePrincipalAmtToBorrow = function() {
          $scope.loanTermMonths2 = convertLoanTermToMonths2();
                                                                                                                                              
          $scope.principalAmtToBorrow = ($scope.calculator.affordableRepayment / ($scope.calculator.interestRate2 / 12)) * (1-(1/(Math.pow(1+($scope.calculator.interestRate2 / 12), $scope.loanTermMonths2))));
          calculateInterestPaid();
        };

        var convertLoanTermToMonths2 = function() {
          return $scope.calculator.loanTermYears2 * 12;
        };

        var calculateInterestPaid = function() {
          $scope.interestPaid = $scope.calculator.affordableRepayment * $scope.loanTermMonths2 - $scope.principalAmtToBorrow;
         
          barArr2.push($scope.principalAmtToBorrow);         
          $scope.barSeries2.push('Scenario 1');
          $scope.barLabels2.push('Affordable Borrow Sum');
          $scope.barData2.push(barArr2);
        };
  
        $scope.calculateTimeToRepay = function() {
          $scope.timeToRepayVal = Math.log(($scope.calculator.monthlyRepayment/($scope.calculator.interestRate3 / 12)/(($scope.calculator.monthlyRepayment / ($scope.calculator.interestRate3 / 12)) - $scope.calculator.amtOwing)) / Math.log(1+($scope.calculator.interestRate3 / 12)));           
          convertToYrsMths();
        };
       

        var convertToYrsMths = function(){
          
          if ($scope.timeToRepayVal > 12) {
             yearMth = $scope.timeToRepayVal / 12;
             year = Math.floor(yearMth);
             month = Math.ceil(yearMth % 1);
            $scope.timeToRepay = year + ' years ' + month +  ' months';

             barArr3.push(yearMth); 

          } else {
              month = Math.ceil($scope.timeToRepayVal);
              $scope.timeToRepay = month +  ' months';

              barArr3.push(month); 
          }

         /* barArr3.push($scope.timeToRepay); */        
          $scope.barSeries3.push('Scenario 1');
          $scope.barLabels3.push('Time To Repay');
          $scope.barData3.push(barArr3);
        };

	}
]);