'use strict';

// Articles controller
angular.module('financial').controller('LoanCalculatorController', ['$scope', '$rootScope', '$stateParams', '$location', 'Authentication', 'Users', '$q', 
  function($scope, $rootScope, $stateParams, $location, Authentication, Users, $q) {
      $scope.user = Authentication.user;

      $scope.monthlyRepaymentSum = 0;
      $scope.totalCostLoan = 0;
      $scope.results = 0;  

      $scope.principalAmtToBorrow = 0;  
      $scope.interestPaid = 0;  
      $scope.formSubmit = false;

      var year = 0;
      var month = 0;
      var yearMth = 0;
      var interestAmt = 0;
      var interestRatePerMth = 0;
      var repaymentOverInterest = 0;
      var cal1 = 0;
      var cal2 = 0;
      $scope.timeToRepay = '0 years 0 months';  

      $scope.isFormOpened = false;
      $scope.showChart = false;
      $scope.barData = [];
      $scope.barOptions = {};

      $scope.monthlyRepaymentSum2 = 0;
      $scope.totalCostLoan2 = 0;
      $scope.results2 = 0;

      $scope.principalAmtToBorrow2 = 0;  
      $scope.interestPaid2 = 0;  

      var year2 = 0;
      var month2 = 0;
      var yearMth2 = 0;
      var interestAmt2 = 0;
      var interestRatePerMth2 = 0;
      var repaymentOverInterest2 = 0;
      var cal12 = 0;
      var cal22 = 0;
      $scope.timeToRepay2 = '0 years 0 months';  


       
       var convertLoanTermToMonths = function() {
          return $scope.calculator.loanTermYears * 12;
        };
        
       var calculateResult = function() {
          $scope.results = $scope.totalCostLoan - $scope.calculator.amtBorrowed;
          
          $scope.showChart = true;

          /* Check if barData already have existing elements */
          if($scope.barData.length > 0){
            // update the array element 0 with the new value
            $scope.barData[0].val_0 = $scope.calculator.amtBorrowed;
            $scope.barData[0].val_1 = $scope.results;

          } else{
             /* Populate the chart data wih principal and interest amt */
              $scope.barData.push({x: 1, val_0: $scope.calculator.amtBorrowed, val_1: $scope.results});

              /* Set the barOptions */
              $scope.barOptions = {
                   axes: {
                      //x: {key: 'x', type: 'linear', labelFunction: function(value) {var labelStr = ""; if(value == 1){ labelStr = 'Repay $' + $scope.monthlyRepaymentSum.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' monthly';} else if(value == 2 && $scope.barData.length == 2){ labelStr = 'Repay $' + $scope.monthlyRepaymentSum2.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' monthly'; } return labelStr;}, ticks: $scope.barData.length + 1},
                      x: {key: 'x', type: 'linear', labelFunction: function() {return '';}, ticks: $scope.barData.length + 1},
                      y: {type: 'linear'}
                   },
      
                stacks: [
                  {
                    axis: 'y',
                    series: ['1', '2']
                  }
                ],
                lineMode: 'cardinal',
                series: [
                  {
                    id: '1',
                    y: 'val_0',
                    label: 'Principal',
                    type: 'column',
                    color: '#1f77b4'
                  },
                  {
                    id: '2',
                    y: 'val_1',
                    label: 'Interest (including fees)',
                    type: 'column',
                    color: '#d62728'
                  }
                ],
                tooltip: {mode: 'scrubber', formatter: function(x, y, series) {return series.label + ' : $' + y.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');}},
                columnsHGap: 20
              };
          }
        };
        

        var calculateTotalLoan = function() {
          $scope.totalCostLoan = $scope.monthlyRepaymentSum * $scope.loanTermMonths + $scope.calculator.fees;
          calculateResult();
        };
        
       $scope.calculateMonthyRepaymentSum = function() {
      
        /*if(!$scope.calculator2.amtBorrowed2.length || !$scope.calculator2.loanTermYears2.length || !$scope.calculator2.interestRate2.length || !$scope.calculator2.fees2.length){
              alert('no');
              $scope.loanTermMonths = convertLoanTermToMonths();
              $scope.monthlyRepaymentSum = $scope.calculator.amtBorrowed / ((1-(1/Math.pow((1+(($scope.calculator.interestRate / 100) / 12)), $scope.loanTermMonths))) / (($scope.calculator.interestRate / 100) / 12));
             // calculateTotalLoan();
             // $scope.loanTermMonths = convertLoanTermToMonths();
              $scope.monthlyRepaymentSum2 = $scope.calculator2.amtBorrowed2 / ((1-(1/Math.pow((1+(($scope.calculator2.interestRate2 / 100) / 12)), $scope.loanTermMonths))) / (($scope.calculator2.interestRate2 / 100) / 12));
              alert($scope.monthlyRepaymentSum2);
              calculateTotalLoan();

        } else{
              alert('test');*/
              /*if(!$scope.calculator2.amtBorrowed2.length){
                alert('yes');
              }else{
                alert('no');
              }*/
              $scope.loanTermMonths = convertLoanTermToMonths();
              $scope.monthlyRepaymentSum = $scope.calculator.amtBorrowed / ((1-(1/Math.pow((1+(($scope.calculator.interestRate / 100) / 12)), $scope.loanTermMonths))) / (($scope.calculator.interestRate / 100) / 12));
              calculateTotalLoan();
              $scope.formSubmit = true;
        //}

         
        };

        
        var calculateInterestPaid = function() {
          $scope.interestPaid = $scope.calculator.affordableRepayment * $scope.loanTermMonths - $scope.principalAmtToBorrow;
         
          $scope.showChart = true;

          /* Check if barData already have existing elements */
          if($scope.barData.length > 0){
            // update the array element 0 with the new value
            $scope.barData[0].val_0 = $scope.principalAmtToBorrow;
            $scope.barData[0].val_1 = $scope.interestPaid;

          } else{
             /* Populate the chart data wih principal and interest amt */
              $scope.barData.push({x: 1, val_0: $scope.principalAmtToBorrow, val_1: $scope.interestPaid});

              /* Set the barOptions */
              $scope.barOptions = {
                   axes: {
                      //x: {key: 'x', type: 'linear', labelFunction: function(value) {var labelStr = ""; if(value == 1){ labelStr = 'Repay $' + $scope.monthlyRepaymentSum.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' monthly';} else if(value == 2 && $scope.barData.length == 2){ labelStr = 'Repay $' + $scope.monthlyRepaymentSum2.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' monthly'; } return labelStr;}, ticks: $scope.barData.length + 1},
                      x: {key: 'x', type: 'linear', labelFunction: function() {return '';}, ticks: $scope.barData.length + 1},
                      y: {type: 'linear'}
                   },
      
                stacks: [
                  {
                    axis: 'y',
                    series: ['1', '2']
                  }
                ],
                lineMode: 'cardinal',
                series: [
                  {
                    id: '1',
                    y: 'val_0',
                    label: 'Principal',
                    type: 'column',
                    color: '#1f77b4'
                  },
                  {
                    id: '2',
                    y: 'val_1',
                    label: 'Interest',
                    type: 'column',
                    color: '#d62728'
                  }
                ],
                tooltip: {mode: 'scrubber', formatter: function(x, y, series) {return series.label + ' : $' + y.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');}},
                columnsHGap: 20
              };
          }
        };

       $scope.calculatePrincipalAmtToBorrow = function() {
          $scope.loanTermMonths = convertLoanTermToMonths();
                                                                                                                                              
          $scope.principalAmtToBorrow = ($scope.calculator.affordableRepayment / (($scope.calculator.interestRate / 100) / 12)) * (1-(1/(Math.pow(1+(($scope.calculator.interestRate / 100) / 12), $scope.loanTermMonths))));
          calculateInterestPaid();
          $scope.formSubmit = true;
        };

        var convertToYrsMths = function(){
          
          if ($scope.timeToRepayVal > 12) {
             yearMth = $scope.timeToRepayVal;
             year = Math.floor(yearMth / 12);
             month = Math.ceil(yearMth % 12);
            $scope.timeToRepay = year + ' years ' + month +  ' months';
            // Calculate interest
            interestAmt = $scope.calculator.monthlyRepayment * yearMth - $scope.calculator.amtOwing;
            

          } else {
              month = Math.ceil($scope.timeToRepayVal);
              $scope.timeToRepay = month +  ' months';
              // Calculate interest
             interestAmt = $scope.calculator.monthlyRepayment * month - $scope.calculator.amtOwing;
          }
             
          $scope.showChart = true;

          /* Check if barData already have existing elements */
          if($scope.barData.length > 0){
            // update the array element 0 with the new value
            $scope.barData[0].val_0 = $scope.calculator.amtOwing;
            $scope.barData[0].val_1 = interestAmt;
 
          } else{
             /* Populate the chart data wih principal and interest amt */
              $scope.barData.push({x: 1, val_0: $scope.calculator.amtOwing, val_1: interestAmt});

              /* Set the barOptions */
              $scope.barOptions = {
                   axes: {
                      x: {key: 'x', type: 'linear', labelFunction: function(value) {var labelStr = ''; if(value === 1){ labelStr = $scope.timeToRepay;} else if(value === 2 && $scope.barData.length === 2){ labelStr = $scope.timeToRepay2; } return labelStr;}, ticks: $scope.barData.length + 1},
                      //x: {key: 'x', type: 'linear', labelFunction: function() {return '';}, ticks: $scope.barData.length + 1},
                      y: {type: 'linear'}
                   },
      
                stacks: [
                  {
                    axis: 'y',
                    series: ['1', '2']
                  }
                ],
                lineMode: 'cardinal',
                series: [
                  {
                    id: '1',
                    y: 'val_0',
                    label: 'Principal',
                    type: 'column',
                    color: '#1f77b4'
                  },
                  {
                    id: '2',
                    y: 'val_1',
                    label: 'Interest',
                    type: 'column',
                    color: '#d62728'
                  }
                ],
                tooltip: {mode: 'scrubber', formatter: function(x, y, series) {return series.label + ' : $' + y.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');}},
                columnsHGap: 20
              };
          }

        };
  
        $scope.calculateTimeToRepay = function() {
 
          interestRatePerMth = (($scope.calculator.interestRate / 100) / 12).toFixed(6);         
          repaymentOverInterest = ($scope.calculator.monthlyRepayment / interestRatePerMth).toFixed(6);
          cal1 = (Math.log(repaymentOverInterest / (repaymentOverInterest - $scope.calculator.amtOwing)).toFixed(6));
          cal2 = (Math.log(1+Number(interestRatePerMth))).toFixed(6);
          
          //$scope.timeToRepayVal = Math.log($scope.calculator.monthlyRepayment / interestRate3PerMth / (($scope.calculator.monthlyRepayment / interestRate3PerMth) - $scope.calculator.amtOwing)) / Math.log(1+interestRate3PerMth);           
          $scope.timeToRepayVal = cal1 / cal2;
          convertToYrsMths();            
          $scope.formSubmit = true;     
       
       };


        $scope.showCompareForm = function() {

          if($scope.isFormOpened === false){
            $scope.isFormOpened = true;
          }else{
            $scope.isFormOpened = false;
          }

        };


        var calculateResult2 = function() {
          $scope.results2 = $scope.totalCostLoan2 - $scope.calculator2.amtBorrowed2;

          //$scope.showChart = true;

          /* Check if barData already have existing elements */
          if($scope.barData.length === 2){
            // update the array element 1 with the new value
            $scope.barData[1].val_0 = $scope.calculator2.amtBorrowed2;
            $scope.barData[1].val_1 = $scope.results2;

          } else{
            /* Populate the chart data wih principal and interest amt */
            $scope.barData.push({x: 2, val_0: $scope.calculator2.amtBorrowed2, val_1: $scope.results2});
            
            /* Dynamically set the number of ticks */
            $scope.barOptions.axes.x.ticks = $scope.barData.length + 1;
          }
        };

        

        var calculateTotalLoan2 = function() {
          $scope.totalCostLoan2 = $scope.monthlyRepaymentSum2 * $scope.loanTermMonthsCal2 + $scope.calculator2.fees2;
          calculateResult2();
        };

        var convertLoanTermToMonthsCal2 = function() {
          return $scope.calculator2.loanTermYears2 * 12;
        };


        $scope.calculateMonthyRepaymentSum2 = function() {
            $scope.loanTermMonthsCal2 = convertLoanTermToMonthsCal2();
            $scope.monthlyRepaymentSum2 = $scope.calculator2.amtBorrowed2 / ((1-(1/Math.pow((1+(($scope.calculator2.interestRate2 / 100) / 12)), $scope.loanTermMonthsCal2))) / (($scope.calculator2.interestRate2 / 100) / 12));
            calculateTotalLoan2();
        };


        var calculateInterestPaid2 = function() {
          $scope.interestPaid2 = $scope.calculator2.affordableRepayment2 * $scope.loanTermMonthsCal2 - $scope.principalAmtToBorrow2;
         
          /* Check if barData already have existing elements */
          if($scope.barData.length === 2){
            // update the array element 1 with the new value
            $scope.barData[1].val_0 = $scope.principalAmtToBorrow2;
            $scope.barData[1].val_1 = $scope.interestPaid2;

          } else{
            /* Populate the chart data wih principal and interest amt */
            $scope.barData.push({x: 2, val_0: $scope.principalAmtToBorrow2, val_1: $scope.interestPaid2});
            
            /* Dynamically set the number of ticks */
            $scope.barOptions.axes.x.ticks = $scope.barData.length + 1;
          }

        };

       $scope.calculatePrincipalAmtToBorrow2 = function() {
          $scope.loanTermMonthsCal2 = convertLoanTermToMonthsCal2();                                                                                                                                             
          $scope.principalAmtToBorrow2 = ($scope.calculator2.affordableRepayment2 / (($scope.calculator2.interestRate2 / 100) / 12)) * (1-(1/(Math.pow(1+(($scope.calculator2.interestRate2 / 100) / 12), $scope.loanTermMonthsCal2))));
          calculateInterestPaid2();
        };


        var convertToYrsMths2 = function(){
          
          if ($scope.timeToRepayVal2 > 12) {
             yearMth2 = $scope.timeToRepayVal2;
             year2 = Math.floor(yearMth2 / 12);
             month2 = Math.ceil(yearMth2 % 12);             
             $scope.timeToRepay2 = year2 + ' years ' + month2 +  ' months';
             //Calculate interest          
             interestAmt2 = $scope.calculator2.monthlyRepayment2 * yearMth2 - $scope.calculator2.amtOwing2;
            // interestAmt2 = $scope.calculator2.monthlyRepayment2 * (year2 * 12 + month2) - $scope.calculator2.amtOwing2;

          } else {
              month2 = Math.ceil($scope.timeToRepayVal2);
              $scope.timeToRepay2 = month2 +  ' months';
              // Calculate interest
              interestAmt2 = $scope.calculator2.monthlyRepayment2 * month2 - $scope.calculator2.amtOwing2;
          }

          /* Check if barData already have existing elements */
          if($scope.barData.length === 2){
            // update the array element 1 with the new value
            $scope.barData[1].val_0 = $scope.calculator2.amtOwing2;
            $scope.barData[1].val_1 = interestAmt2;

          } else{         
            /* Populate the chart data wih principal and interest amt */
            $scope.barData.push({x: 2, val_0: $scope.calculator2.amtOwing2, val_1: interestAmt2});
            /* Dynamically set the number of ticks */
            $scope.barOptions.axes.x.ticks = $scope.barData.length + 1;
          }


        };
  
        $scope.calculateTimeToRepay2 = function() {
        
          interestRatePerMth2 = (($scope.calculator2.interestRate2 / 100)/ 12).toFixed(6);
          repaymentOverInterest2 = ($scope.calculator2.monthlyRepayment2 / interestRatePerMth2).toFixed(6);
          cal12 = (Math.log(repaymentOverInterest2 / (repaymentOverInterest2 - $scope.calculator2.amtOwing2)).toFixed(6));
          cal22 = (Math.log(1+Number(interestRatePerMth2))).toFixed(6);
          
          //$scope.timeToRepayVal = Math.log($scope.calculator.monthlyRepayment / interestRate3PerMth / (($scope.calculator.monthlyRepayment / interestRate3PerMth) - $scope.calculator.amtOwing)) / Math.log(1+interestRate3PerMth);           
          $scope.timeToRepayVal2 = cal12 / cal22;
 
          convertToYrsMths2();                   
       
       };

      
  }
]);
