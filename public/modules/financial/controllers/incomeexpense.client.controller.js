'use strict';

// Articles controller
angular.module('financial').controller('IncomeExpenseController', ['$scope', '$rootScope', '$stateParams', '$location', 'Authentication', 'IncomeExpenseService', 'Users', '$q',
	function($scope, $rootScope, $stateParams, $location, Authentication, IncomeExpenseService, Users, $q) {
		$scope.user = Authentication.user;
        //Check for authentication
        if (!$scope.user) $location.path('/');
        
		this.$setScope = function(context) {
            $scope = context;
        };
        //Questions
        $scope.oneAtATime = false;

        //Chart Settings
        $scope.incomeExpenseChartDisplay = true;
        $scope.incomeDoughnutData = [1]; 
        $scope.expenseDoughnutLabels = ['No Data'];
        $scope.expenseDoughnutData = [1]; 
        $scope.incomeDoughnutLabels = ['No Data'];

        //--DATE Selected
        var current = function() {
            $scope.dt = new Date();
            $scope.month = $scope.dt.getMonth();
            $scope.year = Number($scope.dt.getFullYear());
            $scope.monthDisplay = $scope.selectedMonth;
            console.log($scope.month);
            console.log($scope.year);        
        };

        current();
        $scope.monthArr = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
            ];

        var retrieveRecord = function() {
            $scope.month = $scope.monthArr.indexOf($scope.selectedMonth);
            $scope.monthDisplay = $scope.selectedMonth;
            $scope.year = $scope.selectedYear;
            $scope.recordFound = null;

            if ($scope.success || $scope.error) {
                $scope.success = false;
                $scope.error = false;
            }
            $scope.$watch('user', function() {
                reloadData();
            });
        };


        var reloadData = function() {
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
                }
                //To edit to bar graph
                if(!$scope.displayIncomeExpenseRecords.incomeNormalAmt && !$scope.displayIncomeExpenseRecords.otherIncomeAmt && !$scope.displayIncomeExpenseRecords.fixedExpenseAmt && !$scope.displayIncomeExpenseRecords.transportAmt && !$scope.displayIncomeExpenseRecords.utilityHouseholdAmt && !$scope.displayIncomeExpenseRecords.foodNecessitiesAmt && !$scope.displayIncomeExpenseRecords.miscAmt && !$scope.displayIncomeExpenseRecords.optionalSavingsAmt){
                    $scope.incomeDoughnutData = [1]; 
                    $scope.incomeDoughnutLabels = ['No Data'];
                    $scope.expenseDoughnutData = [1]; 
                    $scope.expenseDoughnutLabels = ['No Data'];
                }else {
                    $scope.incomeDoughnutData = [$scope.displayIncomeExpenseRecords.incomeNormalAmt, $scope.displayIncomeExpenseRecords.otherIncomeAmt]; 
                    $scope.incomeDoughnutLabels = ['Employment Income', 'Other Income'];
                    $scope.expenseDoughnutData = [$scope.displayIncomeExpenseRecords.fixedExpenseAmt, $scope.displayIncomeExpenseRecords.transportAmt, $scope.displayIncomeExpenseRecords.utilityHouseholdAmt, $scope.displayIncomeExpenseRecords.foodNecessitiesAmt, $scope.displayIncomeExpenseRecords.miscAmt, $scope.displayIncomeExpenseRecords.optionalSavingsAmt]; 
                    $scope.expenseDoughnutLabels = ['Fixed Expense', 'Transport', 'Utilities & Household Maintenance', 'Food & Necessities', 'Miscellaneous', 'Optional Savings'];

                    if(parseFloat($scope.displayIncomeExpenseRecords.monthlyIncomeAmt) === 0.00) {
                        $scope.incomeDoughnutData = [1];
                        $scope.incomeDoughnutLabels = ['No Data'];
                    }
                    if(parseFloat($scope.displayIncomeExpenseRecords.monthlyExpenseAmt) === 0.00) {
                       $scope.expenseDoughnutData = [1]; 
                       $scope.expenseDoughnutLabels = ['No Data'];

                    }
                    console.log($scope.incomeDoughnutData);
                }
                if($scope.displayIncomeExpenseRecords.year !== $scope.selectedYear || $scope.monthArr[$scope.displayIncomeExpenseRecords.month] !== $scope.selectedMonth){
                    $scope.recordFound = 'No record exists for selected month/year. Displaying records for ' + $scope.monthArr[$scope.displayIncomeExpenseRecords.month] + ', ' + $scope.displayIncomeExpenseRecords.year;
                }

            };


		$scope.updateUserFinances = function(isValid) {
            if (isValid) {
                $scope.success = $scope.error = null;
                //ONLY when they update
                if (!$scope.user.incomeExpenseRecordsPeriod) {
                    console.log('Hello??');
                    //If there is no existing record
                    $scope.user.incomeExpenseRecordsPeriod = {};
                    $scope.user.incomeExpenseRecordsPeriod.minMonth = $scope.month;
                    $scope.user.incomeExpenseRecordsPeriod.minYear = $scope.year;
                    $scope.user.incomeExpenseRecordsPeriod.maxMonth = $scope.month;
                    $scope.user.incomeExpenseRecordsPeriod.maxYear = $scope.year;

                } else {

                    //To review
                    //If there is only 1 rec
                    if ($scope.user.incomeExpenseRecordsPeriod.minYear === $scope.user.incomeExpenseRecordsPeriod.maxYear && $scope.user.incomeExpenseRecordsPeriod.minMonth === $scope.user.incomeExpenseRecordsPeriod.maxMonth) {
                        if ($scope.year === $scope.user.incomeExpenseRecordsPeriod.minYear) {
                            if ($scope.month < $scope.user.incomeExpenseRecordsPeriod.minMonth) {
                                $scope.user.incomeExpenseRecordsPeriod.minMonth = $scope.month;
                            } else if ($scope.month > $scope.user.incomeExpenseRecordsPeriod.maxMonth) {
                                $scope.user.incomeExpenseRecordsPeriod.maxMonth = $scope.month;
                            }
                        } else if ($scope.year < $scope.user.incomeExpenseRecordsPeriod.minYear) {
                            $scope.user.incomeExpenseRecordsPeriod.minYear = $scope.year;
                            $scope.user.incomeExpenseRecordsPeriod.minMonth = $scope.month;
                        } else if ($scope.year > $scope.user.incomeExpenseRecordsPeriod.maxYear) {
                            $scope.user.incomeExpenseRecordsPeriod.maxYear = $scope.year;
                            $scope.user.incomeExpenseRecordsPeriod.maxMonth = $scope.month;
                        }
                    } else {
                        //If more than 1 rec
                        //If smaller
                        if ($scope.year < $scope.user.incomeExpenseRecordsPeriod.minYear || $scope.year === $scope.user.incomeExpenseRecordsPeriod.minYear && $scope.month < $scope.user.incomeExpenseRecordsPeriod.minMonth) {
                            $scope.user.incomeExpenseRecordsPeriod.minYear = $scope.year;
                            $scope.user.incomeExpenseRecordsPeriod.minMonth = $scope.month;

                        } else if ($scope.year > $scope.user.incomeExpenseRecordsPeriod.maxYear || $scope.year === $scope.user.incomeExpenseRecordsPeriod.maxYear && $scope.month > $scope.user.incomeExpenseRecordsPeriod.maxMonth) {
                            //If bigger
                            $scope.user.incomeExpenseRecordsPeriod.maxYear = $scope.year;
                            $scope.user.incomeExpenseRecordsPeriod.maxMonth = $scope.month;
                        }
                    }

                }

                var errorCheck = 0;
                //Income
                var incomeNormalArr = $scope.displayIncomeExpenseRecords.monthlyIncome.incomeNormal;
                var incomeNormalTotal = 0;
                angular.forEach(incomeNormalArr, function(value, key){
                    incomeNormalTotal = incomeNormalTotal + Number(value.value);
                });

                var otherIncomeArr = $scope.displayIncomeExpenseRecords.monthlyIncome.otherIncome;
                var otherIncomeTotal = 0;
                angular.forEach(otherIncomeArr, function(value, key){
                    otherIncomeTotal = otherIncomeTotal + Number(value.value);
                });
                console.log(otherIncomeTotal);
                //Expense
                var fixedExpenseArr = $scope.displayIncomeExpenseRecords.monthlyExpense.fixedExpense;
                var fixedExpenseTotal = 0;
                angular.forEach(fixedExpenseArr, function(value, key){ 
                    if (value.value<value.recordsTotal) {
                        value.value = value.recordsTotal;
                        alert('Minimum Expense for '+value.description+' is: $'+value.value);
                        errorCheck += 1;
                    }
                    fixedExpenseTotal = fixedExpenseTotal + Number(value.value);
                });

                var transportArr = $scope.displayIncomeExpenseRecords.monthlyExpense.transport;
                var transportTotal = 0;
                angular.forEach(transportArr, function(value, key){
                    if (value.value<value.recordsTotal) {
                        value.value = value.recordsTotal;
                        alert('Minimum Expense for '+value.description+' is: $'+value.value);
                        errorCheck += 1;
                    }
                    transportTotal = transportTotal + Number(value.value);
                });

                var utilityHouseholdArr = $scope.displayIncomeExpenseRecords.monthlyExpense.utilityHousehold;
                var utilityHouseholdTotal = 0;
                angular.forEach(utilityHouseholdArr, function(value, key){
                    if (value.value<value.recordsTotal) {
                        value.value = value.recordsTotal;
                        alert('Minimum Expense for '+value.description+' is: $'+value.value);
                        errorCheck += 1;
                    }
                    utilityHouseholdTotal = utilityHouseholdTotal + Number(value.value);
                });

                var foodNecessitiesArr = $scope.displayIncomeExpenseRecords.monthlyExpense.foodNecessities;
                var foodNecessitiesTotal = 0;
                angular.forEach(foodNecessitiesArr, function(value, key){
                    if (value.value<value.recordsTotal) {
                        value.value = value.recordsTotal;
                        alert('Minimum Expense for '+value.description+' is: $'+value.value);
                        errorCheck += 1;
                    }
                    foodNecessitiesTotal = foodNecessitiesTotal + Number(value.value);
                });

                var miscArr = $scope.displayIncomeExpenseRecords.monthlyExpense.misc;
                var miscTotal = 0;
                angular.forEach(miscArr, function(value, key){
                    if (value.value<value.recordsTotal) {
                        value.value = value.recordsTotal;
                        alert('Minimum Expense for '+value.description+' is: $'+value.value);
                        errorCheck += 1;
                    }
                    miscTotal = miscTotal + Number(value.value);
                });

                var optionalSavingsArr = $scope.displayIncomeExpenseRecords.monthlyExpense.optionalSavings;
                var optionalSavingsTotal = 0;
                angular.forEach(optionalSavingsArr, function(value, key){
                    if (value.value<value.recordsTotal) {
                        value.value = value.recordsTotal;
                        alert('Minimum Expense for '+value.description+' is: $'+value.value);
                        errorCheck += 1;
                    }
                    optionalSavingsTotal = optionalSavingsTotal + Number(value.value);
                });


                var monthlyIncomeAmt = incomeNormalTotal + otherIncomeTotal;
                var monthlyExpenseAmt = fixedExpenseTotal + transportTotal + utilityHouseholdTotal + foodNecessitiesTotal + miscTotal + optionalSavingsTotal;
                var netCashFlow = monthlyIncomeAmt - monthlyExpenseAmt;

                $scope.displayIncomeExpenseRecords.incomeNormalAmt = incomeNormalTotal.toFixed(2);
                $scope.displayIncomeExpenseRecords.otherIncomeAmt = otherIncomeTotal.toFixed(2);

                $scope.displayIncomeExpenseRecords.fixedExpenseAmt = fixedExpenseTotal.toFixed(2);
                $scope.displayIncomeExpenseRecords.transportAmt = transportTotal.toFixed(2);
                $scope.displayIncomeExpenseRecords.utilityHouseholdAmt = utilityHouseholdTotal.toFixed(2);
                $scope.displayIncomeExpenseRecords.foodNecessitiesAmt = foodNecessitiesTotal.toFixed(2);
                $scope.displayIncomeExpenseRecords.miscAmt = miscTotal.toFixed(2);           
                $scope.displayIncomeExpenseRecords.optionalSavingsAmt = optionalSavingsTotal.toFixed(2);    

                $scope.displayIncomeExpenseRecords.monthlyIncomeAmt = monthlyIncomeAmt.toFixed(2);
                $scope.displayIncomeExpenseRecords.monthlyExpenseAmt = monthlyExpenseAmt.toFixed(2);
                $scope.displayIncomeExpenseRecords.netCashFlow = netCashFlow.toFixed(2);

                if (!$scope.user.incomeExpenseRecords) {
                    $scope.user.incomeExpenseRecords = [];
                    $scope.user.incomeExpenseRecords.push($scope.displayIncomeExpenseRecords);
                } else {
                    var recordExist = false;
                    for (var num = 0; num < $scope.user.incomeExpenseRecords.length; num++) {
                        if ($scope.user.incomeExpenseRecords[num].year === $scope.year && $scope.user.incomeExpenseRecords[num].month === $scope.month) {
                            //If exist, update	
                            $scope.user.incomeExpenseRecords[num] = $scope.displayIncomeExpenseRecords;
                            recordExist = true;
                        }
                    }
                    //else insert
                    console.log(recordExist);
                    console.log($scope.displayIncomeExpenseRecords);
                    console.log($scope.user.incomeExpenseRecords);
                    if (recordExist === false) {
                        var toInsertArr = angular.copy($scope.displayIncomeExpenseRecords);
                        toInsertArr.year = angular.copy($scope.year);
                        toInsertArr.month = angular.copy($scope.month);
                        $scope.user.incomeExpenseRecords.push(toInsertArr);
                    }
                }
                if (errorCheck===0) {
                    $scope.user.updatedIncomeExpense = true;
                    var user = new Users($scope.user);
                    user.$update(function(response) {
                        $scope.success = true;

                        Authentication.user = response;
                        $scope.user = Authentication.user;
                    }, function(response) {
                        $scope.error = response.data.message;
                    });
                }
            } else {
                $scope.submitted = true;
            }
        };

        $scope.$watch('selectedMonth', function(){
            retrieveRecord();
        });
        $scope.$watch('selectedYear', function(){
            retrieveRecord();
        });

        $scope.clearSuccessMessage = function(){
            if ($scope.success || $scope.error) {
                $scope.success = false;
                $scope.error = false;
            }
        };
	}
]);