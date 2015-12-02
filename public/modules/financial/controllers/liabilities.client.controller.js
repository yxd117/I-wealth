'use strict';

// Articles controller
angular.module('financial').controller('LiabilitiesController', ['$scope', '$rootScope', '$stateParams', '$location', 'Authentication', 'LiabilitiesService', 'Users', '$q',
	function($scope, $rootScope, $stateParams, $location, Authentication, LiabilitiesService, Users, $q) {
		$scope.user = Authentication.user;
        //Check for authentication
        if (!$scope.user) $location.path('/');

        this.$setScope = function(context) {
            $scope = context;
        };
        //Questions
        $scope.oneAtATime = false;

        //--DATE Selected
        var current = function() {
            $scope.dt = new Date();
            $scope.month = $scope.dt.getMonth();
            $scope.year = Number($scope.dt.getFullYear());
            $scope.monthDisplay = $scope.selectedMonth;
        };


        //Chart display
        $scope.liabilitiesChartDisplay = true;
        $scope.liabilitiesDoughnutData = [1]; 
        $scope.liabilitiesDoughnutLabels = ['No Data'];

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
            if (!$scope.user.liabilitiesRecordsPeriod || ($scope.user.liabilitiesRecordsPeriod.minMonth > $scope.month && $scope.user.liabilitiesRecordsPeriod.minYear >= $scope.year) || ( $scope.user.liabilitiesRecordsPeriod.minYear > $scope.year)) {

            	$scope.displayLiabilitiesRecords = angular.copy(LiabilitiesService.liabilitiesRecords);
            	$scope.displayLiabilitiesRecords.year = angular.copy($scope.year);
            	$scope.displayLiabilitiesRecords.month = angular.copy($scope.month);
                $scope.recordFound = 'No record exists for and prior to selected month/year.';

            } else {

                if ($scope.user.liabilitiesRecordsPeriod.minMonth === $scope.user.liabilitiesRecordsPeriod.maxMonth && $scope.user.liabilitiesRecordsPeriod.minYear === $scope.user.liabilitiesRecordsPeriod.maxYear) {
                    $scope.displayLiabilitiesRecords = angular.copy($scope.user.liabilitiesRecords[0]);
                } else {
                    // IF there is multiple record

                    //TO review
                    var targetYear;
                    var targetMonth;
                    var minimumYear = $scope.user.liabilitiesRecordsPeriod.minYear;
                    var minimumMonth = $scope.user.liabilitiesRecordsPeriod.minMonth;
                    var maximumYear = $scope.user.liabilitiesRecordsPeriod.maxYear;
                    var maximumMonth = $scope.user.liabilitiesRecordsPeriod.maxMonth;

                    var latestYear = minimumYear;
                    var latestMonth = minimumMonth;

                    var latestRecord;

                    if ($scope.year > maximumYear || $scope.year === maximumYear && $scope.month >= maximumMonth) {
                        //Date after max
                        targetYear = maximumYear;
                        targetMonth = maximumMonth;
                        for (var r2 in $scope.user.liabilitiesRecords) {
                            if ($scope.user.liabilitiesRecords[r2].year === targetYear && $scope.user.liabilitiesRecords[r2].month === targetMonth) {
                                latestRecord = angular.copy($scope.user.liabilitiesRecords[r2]);
                            }
                        }
                    } else {
                        //Date in between
                        targetYear = $scope.year;
                        targetMonth = $scope.month;
                        for (var r3 in $scope.user.liabilitiesRecords) {
                            if ($scope.user.liabilitiesRecords[r3].year < targetYear || $scope.user.liabilitiesRecords[r3].year === targetYear && $scope.user.liabilitiesRecords[r3].month <= targetMonth) {
                                if ($scope.user.liabilitiesRecords[r3].year === latestYear && $scope.user.liabilitiesRecords[r3].month >= latestMonth) {
                                    latestRecord = angular.copy($scope.user.liabilitiesRecords[r3]);
                                    latestMonth = angular.copy($scope.user.liabilitiesRecords[r3].month);
                                } else if ($scope.user.liabilitiesRecords[r3].year > latestYear) {
                                    latestRecord = angular.copy($scope.user.liabilitiesRecords[r3]);
                                    latestMonth = angular.copy($scope.user.liabilitiesRecords[r3].month);
                                    latestYear = angular.copy($scope.user.liabilitiesRecords[r3].year);
                                }
                            }
                        }
                    }
                    $scope.displayLiabilitiesRecords = latestRecord;
                }
            }
            if(!$scope.displayLiabilitiesRecords.shortTermCreditAmt && !$scope.displayLiabilitiesRecords.loansMortgagesAmt && !$scope.displayLiabilitiesRecords.otherLiabilitiesAmt){
                $scope.liabilitiesDoughnutData = [1]; 
                $scope.liabilitiesDoughnutLabels = ['No Data'];
            } else{
                $scope.liabilitiesDoughnutData = [$scope.displayLiabilitiesRecords.shortTermCreditAmt, $scope.displayLiabilitiesRecords.loansMortgagesAmt, $scope.displayLiabilitiesRecords.otherLiabilitiesAmt];
                $scope.liabilitiesDoughnutLabels = ['Short-Term Credit', 'Loans & Mortgages', 'Other Liabilities'];
            }

            if($scope.displayLiabilitiesRecords.year !== $scope.selectedYear || $scope.monthArr[$scope.displayLiabilitiesRecords.month] !== $scope.selectedMonth){
                $scope.recordFound = 'No record exists for selected month/year. Displaying records for ' + $scope.monthArr[$scope.displayLiabilitiesRecords.month] + ', ' + $scope.displayLiabilitiesRecords.year;
            }

        };
	
		$scope.updateUserFinances = function(isValid) {
            if (isValid) {
                $scope.success = $scope.error = null;
                //ONLY when they update
                if (!$scope.user.liabilitiesRecordsPeriod) {
                    //If there is no existing record
                    $scope.user.liabilitiesRecordsPeriod = {};
                    $scope.user.liabilitiesRecordsPeriod.minMonth = $scope.month;
                    $scope.user.liabilitiesRecordsPeriod.minYear = $scope.year;
                    $scope.user.liabilitiesRecordsPeriod.maxMonth = $scope.month;
                    $scope.user.liabilitiesRecordsPeriod.maxYear = $scope.year;

                } else {

                    //To review
                    //If there is only 1 rec
                    if ($scope.user.liabilitiesRecordsPeriod.minYear === $scope.user.liabilitiesRecordsPeriod.maxYear && $scope.user.liabilitiesRecordsPeriod.minMonth === $scope.user.liabilitiesRecordsPeriod.maxMonth) {
                        if ($scope.year === $scope.user.liabilitiesRecordsPeriod.minYear) {
                            if ($scope.month < $scope.user.liabilitiesRecordsPeriod.minMonth) {
                                $scope.user.liabilitiesRecordsPeriod.minMonth = $scope.month;
                            } else if ($scope.month > $scope.user.liabilitiesRecordsPeriod.maxMonth) {
                                $scope.user.liabilitiesRecordsPeriod.maxMonth = $scope.month;
                            }
                        } else if ($scope.year < $scope.user.liabilitiesRecordsPeriod.minYear) {
                            $scope.user.liabilitiesRecordsPeriod.minYear = $scope.year;
                            $scope.user.liabilitiesRecordsPeriod.minMonth = $scope.month;
                        } else if ($scope.year > $scope.user.liabilitiesRecordsPeriod.maxYear) {
                            $scope.user.liabilitiesRecordsPeriod.maxYear = $scope.year;
                            $scope.user.liabilitiesRecordsPeriod.maxMonth = $scope.month;
                        }
                    } else {
                        //If more than 1 rec
                        //If smaller
                        if ($scope.year < $scope.user.liabilitiesRecordsPeriod.minYear || $scope.year === $scope.user.liabilitiesRecordsPeriod.minYear && $scope.month < $scope.user.liabilitiesRecordsPeriod.minMonth) {
                            $scope.user.liabilitiesRecordsPeriod.minYear = $scope.year;
                            $scope.user.liabilitiesRecordsPeriod.minMonth = $scope.month;

                        } else if ($scope.year > $scope.user.liabilitiesRecordsPeriod.maxYear || $scope.year === $scope.user.liabilitiesRecordsPeriod.maxYear && $scope.month > $scope.user.liabilitiesRecordsPeriod.maxMonth) {
                            //If bigger
                            $scope.user.liabilitiesRecordsPeriod.maxYear = $scope.year;
                            $scope.user.liabilitiesRecordsPeriod.maxMonth = $scope.month;
                        }
                    }

                }

                var errorCheck = 0;
                var shortTermCreditArr = $scope.displayLiabilitiesRecords.shortTermCredit;
                var shortTermCreditTotal = 0;
                angular.forEach(shortTermCreditArr, function(value, key){
                    shortTermCreditTotal = shortTermCreditTotal + Number(value.value);
                });

                var loansMortgagesArr = $scope.displayLiabilitiesRecords.loansMortgages;
                var loansMortgagesTotal = 0;
                angular.forEach(loansMortgagesArr, function(value, key){
                    if(value.value<value.minValue) {
                        value.value = value.minValue; 
                        alert('Minimum liability value for '+value.description+' is: $'+value.value);
                        errorCheck++;
                        location.reload();
                    }
                    loansMortgagesTotal = loansMortgagesTotal + Number(value.value);
                });

                var otherLiabilitiesArr = $scope.displayLiabilitiesRecords.otherLiabilities;
                var otherLiabilitiesTotal = 0;
                angular.forEach(otherLiabilitiesArr, function(value, key){
                    otherLiabilitiesTotal = otherLiabilitiesTotal + Number(value.value);
                });


                var liabilitiesTotal = shortTermCreditTotal + loansMortgagesTotal + otherLiabilitiesTotal;

                $scope.displayLiabilitiesRecords.shortTermCreditAmt = shortTermCreditTotal.toFixed(2);
                $scope.displayLiabilitiesRecords.loansMortgagesAmt = loansMortgagesTotal.toFixed(2);
                $scope.displayLiabilitiesRecords.otherLiabilitiesAmt = otherLiabilitiesTotal.toFixed(2);
                $scope.displayLiabilitiesRecords.totalAmt = liabilitiesTotal.toFixed(2);

                if (!$scope.user.liabilitiesRecords) {
                    $scope.user.liabilitiesRecords = [];
                    $scope.user.liabilitiesRecords.push($scope.displayLiabilitiesRecords);
                } else {
                    var recordExist = false;
                    for (var num = 0; num < $scope.user.liabilitiesRecords.length; num++) {
                        if ($scope.user.liabilitiesRecords[num].year === $scope.year && $scope.user.liabilitiesRecords[num].month === $scope.month) {
                            //If exist, update	
                            $scope.user.liabilitiesRecords[num] = $scope.displayLiabilitiesRecords;
                            recordExist = true;
                        }
                    }
                    //else insert
                    if (recordExist === false) {
                        var toInsertArr = angular.copy($scope.displayLiabilitiesRecords);
                        toInsertArr.year = angular.copy($scope.year);
                        toInsertArr.month = angular.copy($scope.month);
                        $scope.user.liabilitiesRecords.push(toInsertArr);
                    }
                }

                $scope.user.updatedLiabilities = true;
                var user = new Users($scope.user);
                user.$update(function(response) {
                    $scope.success = true;

                    Authentication.user = response;
                    $scope.user = Authentication.user;
                    $scope.recordFound = null;
                }, function(response) {
                    $scope.error = response.data.message;
                });
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