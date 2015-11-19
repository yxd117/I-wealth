'use strict';

// Articles controller
angular.module('financialtools').controller('RetirementPlanningController', ['$scope', '$rootScope', '$stateParams', '$location', 'Authentication', 'Users', '$q', 'IncomeExpenseService',
  function($scope, $rootScope, $stateParams, $location, Authentication, Users, $q, IncomeExpenseService) {
      $scope.user = Authentication.user;
      if (!$scope.user) $location.path('/');

      //Retirement Savings Calculator results
      $scope.amtOfCashAtRetirementAge = 0;
      $scope.savingsPerMonthTillRetirement = 0;
      $scope.yearsToRetirement = 0;
      $scope.savingsPerYearTillRetirement = 0; //for compounding calculator
      $scope.totalAmtSavedWithCompounding = 0; //for compounding calculator
      $scope.retirementMonthlyIncomeWithInterest = 0; //for compounding calculator

       //Retirement Savings Shortfall/Surplus and Ratios
      $scope.currentSavingToRetirementSaving = 0;
      $scope.currentSavingToRetirementSavingAnalysis = 'unhealthy';
      $scope.currentSavingToIncomeRatio = 0;
      $scope.currentSavingToIncomeRatioAnalysis = 'unhealthy'; 
      $scope.retirementSavingToIncomeRatio = 0;
      $scope.retirementSavingToIncomeRatioAnalysis = 'unhealthy'; 
      
      //CPF Retirement Benchmark Calculation results
      $scope.retirementAmtAt55 = 0;
      $scope.retirementAmtCompoundedAt55 = 0; //for compounding calculator
      //Minimum amount for Basic Retirement Sum
      $scope.minBrsInflationAdjusted = 0;
      $scope.minBrsRealReturnsAdjusted = 0;
      //Minimum amount for Full Retirement Sum
      $scope.minFrsInflationAdjusted = 0;
      $scope.minFrsRealReturnsAdjusted = 0;
      //Minimum amount for Enhanced Retirement Sum
      $scope.minErsInflationAdjusted = 0;
      $scope.minErsRealReturnsAdjusted = 0;
      //Basic Retirement Sum Analysis
      $scope.minBrsInflationAdjustedAnalysis = 'unhealthy';
      $scope.minBrsRealReturnsAdjustedAnalysis = 'unhealthy';
      //Full Retirement Sum Analysis
      $scope.minFrsInflationAdjustedAnalysis = 'unhealthy';
      $scope.minFrsRealReturnsAdjustedAnalysis = 'unhealthy';
      //Enhanced Retirement Sum Analysis
      $scope.minErsInflationAdjustedAnalysis = 'unhealthy';
      $scope.minErsRealReturnsAdjustedAnalysis = 'unhealthy';

      //Additional Details
      $scope.interestEarned = 0;
      var sgsYield = 0.02;

      //current Minimum Full Retirement Sum required at age 55 as of 2015
      var currentFRS = 161000;
      var currentBRS = 80500;
      var currentERS = 241500;

      //variables for compounding calculation
      var annualCompounding = 1;

      //to calculate results for without interest and no compounding factor
      //Retrieve income expense record
      var current = function() {
        $scope.dt = new Date();
        $scope.month = $scope.dt.getMonth();
        $scope.year = Number($scope.dt.getFullYear());
        if (!$scope.user.incomeExpenseRecordsPeriod || ($scope.user.incomeExpenseRecordsPeriod.minMonth > $scope.month && $scope.user.incomeExpenseRecordsPeriod.minYear >= $scope.year) || ( $scope.user.incomeExpenseRecordsPeriod.minYear > $scope.year)) {
          $scope.displayIncomeExpenseRecords = angular.copy(IncomeExpenseService.incomeExpenseRecords);
          $scope.displayIncomeExpenseRecords.year = angular.copy($scope.year);
          $scope.displayIncomeExpenseRecords.month = angular.copy($scope.month);
            $scope.recordFound = 'No record exists for and prior to selected month/year.';

        } else {

            if ($scope.user.incomeExpenseRecordsPeriod.minMonth === $scope.user.incomeExpenseRecordsPeriod.maxMonth && $scope.user.incomeExpenseRecordsPeriod.minYear === $scope.user.incomeExpenseRecordsPeriod.maxYear) {
                $scope.displayIncomeExpenseRecords = angular.copy($scope.user.incomeExpenseRecords[0]);
            } else {
                // IF there is multiple record

                //TO review
                var targetYear;
                var targetMonth;
                var minimumYear = $scope.user.incomeExpenseRecordsPeriod.minYear;
                var minimumMonth = $scope.user.incomeExpenseRecordsPeriod.minMonth;
                var maximumYear = $scope.user.incomeExpenseRecordsPeriod.maxYear;
                var maximumMonth = $scope.user.incomeExpenseRecordsPeriod.maxMonth;

                var latestYear = minimumYear;
                var latestMonth = minimumMonth;

                var latestRecord;

                if ($scope.year > maximumYear || $scope.year === maximumYear && $scope.month >= maximumMonth) {
                    //Date after max
                    targetYear = maximumYear;
                    targetMonth = maximumMonth;
                    for (var r2 in $scope.user.incomeExpenseRecords) {
                        if ($scope.user.incomeExpenseRecords[r2].year === targetYear && $scope.user.incomeExpenseRecords[r2].month === targetMonth) {
                            latestRecord = angular.copy($scope.user.incomeExpenseRecords[r2]);
                        }
                    }
                } else {
                    //Date in between
                    targetYear = $scope.year;
                    targetMonth = $scope.month;
                    for (var r3 in $scope.user.incomeExpenseRecords) {
                        if ($scope.user.incomeExpenseRecords[r3].year < targetYear || $scope.user.incomeExpenseRecords[r3].year === targetYear && $scope.user.incomeExpenseRecords[r3].month <= targetMonth) {
                            if ($scope.user.incomeExpenseRecords[r3].year === latestYear && $scope.user.incomeExpenseRecords[r3].month >= latestMonth) {
                                latestRecord = angular.copy($scope.user.incomeExpenseRecords[r3]);
                                latestMonth = angular.copy($scope.user.incomeExpenseRecords[r3].month);
                            } else if ($scope.user.incomeExpenseRecords[r3].year > latestYear) {
                                latestRecord = angular.copy($scope.user.incomeExpenseRecords[r3]);
                                latestMonth = angular.copy($scope.user.incomeExpenseRecords[r3].month);
                                latestYear = angular.copy($scope.user.incomeExpenseRecords[r3].year);
                            }
                        }
                    }
                }
                $scope.displayIncomeExpenseRecords = latestRecord;
            }
            $scope.monthlyIncomeAmt = $scope.displayIncomeExpenseRecords.monthlyIncomeAmt;
            $scope.annualIncome = $scope.monthlyIncomeAmt *12;
            
        }
      };
      current();

      //Amount of Cash at Retirement Age
      var calculateCashAtRetirementAge = function(){
        $scope.amtOfCashAtRetirementAge = $scope.calculator.monthlyRetirementAmt * 12 * $scope.calculator.yearsOfRetirementIncome;
      };

      //Number of years until Retirement
      var calculateYearsToRetirement = function(){
        $scope.yearsToRetirement = $scope.calculator.retirementAge - $scope.calculator.currentAge;
      };

      //Required Savings per Month until Retirement
      var calculateSavingsPerMonthTillRetire = function(){
        $scope.savingsPerMonthTillRetirement = $scope.amtOfCashAtRetirementAge / ($scope.yearsToRetirement * 12);
      };

      //Current Saving to Retirement Saving Surplus/Shortfall 
      var calculateCurrentSavingsToRetirementSavings = function(){
        $scope.currentSavingToRetirementSaving = $scope.calculator.currentMthSavings - $scope.savingsPerMonthTillRetirement;

        if ($scope.currentSavingToRetirementSaving >= 0) {
          $scope.currentSavingToRetirementSavingAnalysis = 'healthy';
        } 
      };

      //Your Current Saving to Income Ratio
      var calculateCurrentSavingToIncomeRatio = function(){
        $scope.currentSavingToIncomeRatio = ($scope.calculator.currentMthSavings / ($scope.calculator.annualIncome/12)).toFixed(2);

        if ($scope.currentSavingToIncomeRatio > 0.12) {
          $scope.currentSavingToIncomeRatioAnalysis = 'healthy';
        }

      };

      //Your Retirement Saving To Income Ratio
      var calculateRetirementSavingToIncomeRatio = function(){
       $scope.retirementSavingToIncomeRatio = ($scope.savingsPerMonthTillRetirement / ($scope.calculator.annualIncome/12)).toFixed(2);

       if ($scope.retirementSavingToIncomeRatio > 0.12) {
          $scope.retirementSavingToIncomeRatioAnalysis = 'healthy';
        }
      };      

      //Interest earned on amount saved after 1st Year
      var calculateInterestEarned = function(){
        $scope.interestEarned = $scope.savingsPerMonthTillRetirement * 12 * sgsYield;
      };

      //Retirement Amount Required at age 55
      var calculateRetirementAmtAt55 = function(){
        $scope.retirementAmtAt55 = $scope.calculator.currentMthSavings * 12 * (55 - $scope.calculator.currentAge);
      };

      //Calculate CPF Retirement Benchmark for Inflation and Real Return for BRS
      var calculateBRSBenchmark = function(){
        $scope.minBrsInflationAdjusted = currentBRS * Math.pow((1 + $scope.calculator.inflationRate/100), (55 - $scope.calculator.currentAge));
        $scope.minBrsRealReturnsAdjusted = currentBRS * Math.pow((1 + ($scope.calculator.returnRate/100 - $scope.calculator.inflationRate/100)),(55 - $scope.calculator.currentAge));
        
      };

      //Calculate CPF Retirement Benchmark for Inflation and Real Return for FRS
      var calculateFRSBenchmark = function(){
        $scope.minFrsInflationAdjusted = currentFRS * Math.pow((1 + $scope.calculator.inflationRate/100), (55 - $scope.calculator.currentAge));
        $scope.minFrsRealReturnsAdjusted = currentFRS * Math.pow((1 + ($scope.calculator.returnRate/100 - $scope.calculator.inflationRate/100)),(55 - $scope.calculator.currentAge));
        
      };

      //Calculate CPF Retirement Benchmark for Inflation and Real Return for ERS
      var calculateERSBenchmark = function(){
        $scope.minErsInflationAdjusted = currentERS * Math.pow((1 + $scope.calculator.inflationRate/100), (55 - $scope.calculator.currentAge));
        $scope.minErsRealReturnsAdjusted = currentERS * Math.pow((1 + ($scope.calculator.returnRate/100 - $scope.calculator.inflationRate/100)),(55 - $scope.calculator.currentAge));
        
      };

      //Calculate whether user is above/below CPF benchmark
      var calculateAnalysis = function(){
        if ($scope.minBrsInflationAdjusted < $scope.retirementAmtAt55) {
          $scope.minBrsInflationAdjustedAnalysis = 'healthy';
        }

        if ($scope.minBrsRealReturnsAdjusted < $scope.retirementAmtAt55) {
          $scope.minBrsRealReturnsAdjustedAnalysis = 'healthy';
        } 

        if ($scope.minFrsInflationAdjusted < $scope.retirementAmtAt55) {
          $scope.minFrsInflationAdjustedAnalysis = 'healthy';
        }

        if ($scope.minFrsRealReturnsAdjusted < $scope.retirementAmtAt55) {
          $scope.minFrsRealReturnsAdjustedAnalysis = 'healthy';
        } 

        if ($scope.minErsInflationAdjusted < $scope.retirementAmtAt55) {
          $scope.minErsInflationAdjustedAnalysis = 'healthy';
        }

        if ($scope.minErsRealReturnsAdjusted < $scope.retirementAmtAt55) {
          $scope.minErsRealReturnsAdjustedAnalysis = 'healthy';
        } 

      };

      //Calculate whether user is above/below CPF benchmark
      var calculateAnalysisCompounded = function(){
        if ($scope.minBrsInflationAdjusted < $scope.retirementAmtCompoundedAt55) {
          $scope.minBrsInflationAdjustedAnalysis = 'healthy';
        }

        if ($scope.minBrsRealReturnsAdjusted < $scope.retirementAmtCompoundedAt55) {
          $scope.minBrsRealReturnsAdjustedAnalysis = 'healthy';
        } 

        if ($scope.minFrsInflationAdjusted < $scope.retirementAmtCompoundedAt55) {
          $scope.minFrsInflationAdjustedAnalysis = 'healthy';
        }

        if ($scope.minFrsRealReturnsAdjusted < $scope.retirementAmtCompoundedAt55) {
          $scope.minFrsRealReturnsAdjustedAnalysis = 'healthy';
        } 

        if ($scope.minErsInflationAdjusted < $scope.retirementAmtCompoundedAt55) {
          $scope.minErsInflationAdjustedAnalysis = 'healthy';
        }

        if ($scope.minErsRealReturnsAdjusted < $scope.retirementAmtCompoundedAt55) {
          $scope.minErsRealReturnsAdjustedAnalysis = 'healthy';
        } 

      };

      //Calculating amount of savings user will have per year until retirement based on current monthly
      var calculateSavingsPerYearTillRetirement = function(){
        $scope.savingsPerYearTillRetirement = $scope.savingsPerMonthTillRetirement * 12;
      };

      //Total Amount Saved with Compounding Interest at _ years old  
      var calculateTotalAmtWithCompounding = function(){
        var i = $scope.calculator.interestRate/100;
        var p1 = 1+(i/annualCompounding);
        var p2 = (annualCompounding * $scope.yearsToRetirement);
        var pt1 = Math.pow(p1, p2) - 1;
        var pt2 = i/annualCompounding;
        $scope.totalAmtSavedWithCompounding = $scope.savingsPerYearTillRetirement * (pt1/pt2);
      };

      //Retirement Monthly Income if Annual Return is _%
      var calculateRetirementMonthlyIncomeWithInterest = function(){
        $scope.retirementMonthlyIncomeWithInterest = $scope.totalAmtSavedWithCompounding / (12*$scope.calculator.yearsOfRetirementIncome);
      };

      //Retirement Amount Required at age _ (compounded)
      var calculateRetirementAmtCompoundedAt55 = function(){
        var i = $scope.calculator.interestRate/100;
        var p1 = 1 + (i/annualCompounding);
        var p2 = annualCompounding * (55 - $scope.calculator.currentAge);
        var pt1 = Math.pow(p1, p2) - 1;
        var pt2 = i/annualCompounding;
        $scope.retirementAmtCompoundedAt55 = ($scope.savingsPerYearTillRetirement) * (pt1/pt2) ;
      };



      $scope.calculateRetirement = function(){
        //Retirement Savings Calculator results
        calculateCashAtRetirementAge();
        calculateYearsToRetirement();
        calculateSavingsPerMonthTillRetire();
        calculateCurrentSavingsToRetirementSavings();
        calculateCurrentSavingToIncomeRatio();
        calculateRetirementSavingToIncomeRatio();
        //Addtional Information Results
        calculateInterestEarned();

        //CPF Retirement Benchmark
        calculateRetirementAmtAt55();
        calculateBRSBenchmark();
        calculateFRSBenchmark();
        calculateERSBenchmark();
        calculateAnalysis();
      };

      //to calculate results for y% interest and compounding factor
      $scope.calculateRetirementWithInterest = function(){
        //Retirement Savings Calculator Results
        calculateYearsToRetirement();
        calculateCashAtRetirementAge();
        calculateSavingsPerMonthTillRetire();
        calculateSavingsPerYearTillRetirement();
        calculateTotalAmtWithCompounding();
        calculateRetirementMonthlyIncomeWithInterest();
        calculateCurrentSavingsToRetirementSavings();
        calculateCurrentSavingToIncomeRatio();
        calculateRetirementSavingToIncomeRatio();

        //CPF Retirement Benchmark
        calculateRetirementAmtCompoundedAt55();
        calculateBRSBenchmark();
        calculateFRSBenchmark();
        calculateERSBenchmark();
        calculateAnalysisCompounded();


      };

      
  }
]);
