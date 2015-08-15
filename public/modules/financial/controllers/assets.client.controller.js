'use strict';

// Articles controller
angular.module('financial').controller('AssetsController', ['$scope', '$rootScope', '$stateParams', '$location', 'Authentication', 'AssetsService', 'Users', '$q',
    function($scope, $rootScope, $stateParams, $location, Authentication, AssetsService, Users, $q) {
        $scope.user = Authentication.user;

        // If user is not signed in then redirect back home
        if (!$scope.user) $location.path('/');
        
        this.$setScope = function(context) {
            $scope = context;
        };
        //Questions
        $scope.oneAtATime = false;
        
        $scope.assetChartDisplay = true;
        $scope.assetsDoughnutData = [1]; 
        $scope.assetsDoughnutLabels = ['No Data'];

        $scope.updateUserFinances = function(isValid) {
            if (isValid) {
                $scope.success = $scope.error = null;
                //ONLY when they update
                if (!$scope.user.assetsRecordsPeriod) {
                    //If there is no existing record
                    $scope.user.assetsRecordsPeriod = {};
                    $scope.user.assetsRecordsPeriod.minMonth = $scope.month;
                    $scope.user.assetsRecordsPeriod.minYear = $scope.year;
                    $scope.user.assetsRecordsPeriod.maxMonth = $scope.month;
                    $scope.user.assetsRecordsPeriod.maxYear = $scope.year;

                } else {

                    //To review
                    //If there is only 1 rec
                    if ($scope.user.assetsRecordsPeriod.minYear === $scope.user.assetsRecordsPeriod.maxYear && $scope.user.assetsRecordsPeriod.minMonth === $scope.user.assetsRecordsPeriod.maxMonth) {
                        if ($scope.year === $scope.user.assetsRecordsPeriod.minYear) {
                            if ($scope.month < $scope.user.assetsRecordsPeriod.minMonth) {
                                $scope.user.assetsRecordsPeriod.minMonth = $scope.month;
                            } else if ($scope.month > $scope.user.assetsRecordsPeriod.maxMonth) {
                                $scope.user.assetsRecordsPeriod.maxMonth = $scope.month;
                            }
                        } else if ($scope.year < $scope.user.assetsRecordsPeriod.minYear) {
                            $scope.user.assetsRecordsPeriod.minYear = $scope.year;
                            $scope.user.assetsRecordsPeriod.minMonth = $scope.month;
                        } else if ($scope.year > $scope.user.assetsRecordsPeriod.maxYear) {
                            $scope.user.assetsRecordsPeriod.maxYear = $scope.year;
                            $scope.user.assetsRecordsPeriod.maxMonth = $scope.month;
                        }
                    } else {
                        //If more than 1 rec
                        //If smaller
                        if ($scope.year < $scope.user.assetsRecordsPeriod.minYear || $scope.year === $scope.user.assetsRecordsPeriod.minYear && $scope.month < $scope.user.assetsRecordsPeriod.minMonth) {
                            $scope.user.assetsRecordsPeriod.minYear = $scope.year;
                            $scope.user.assetsRecordsPeriod.minMonth = $scope.month;

                        } else if ($scope.year > $scope.user.assetsRecordsPeriod.maxYear || $scope.year === $scope.user.assetsRecordsPeriod.maxYear && $scope.month > $scope.user.assetsRecordsPeriod.maxMonth) {
                            //If bigger
                            $scope.user.assetsRecordsPeriod.maxYear = $scope.year;
                            $scope.user.assetsRecordsPeriod.maxMonth = $scope.month;
                        }
                    }

                }

                var cashEquivalentsArr = $scope.displayAssetsRecords.cashEquivalents;
                var cashEquivalentsTotal = 0;
                angular.forEach(cashEquivalentsArr, function(value, key){
                    cashEquivalentsTotal = cashEquivalentsTotal + Number(value.value);
                });

                var personalUseAssetsArr = $scope.displayAssetsRecords.personalUseAssets;
                var personalUseAssetsTotal = 0;
                angular.forEach(personalUseAssetsArr, function(value, key){
                    personalUseAssetsTotal = personalUseAssetsTotal + Number(value.value);
                });

                var investedAssetsArr = $scope.displayAssetsRecords.investedAssets;
                var investedAssetsTotal = 0;
                angular.forEach(investedAssetsArr, function(value, key){
                    investedAssetsTotal = investedAssetsTotal + Number(value.value);
                });

                var cpfSavingsArr = $scope.displayAssetsRecords.cpfSavings;
                var cpfSavingsTotal = 0;
                angular.forEach(cpfSavingsArr, function(value, key){
                    cpfSavingsTotal = cpfSavingsTotal + Number(value.value);
                });

                var otherAssetsArr = $scope.displayAssetsRecords.otherAssets;
                var otherAssetsTotal = 0;
                angular.forEach(otherAssetsArr, function(value, key){
                    otherAssetsTotal = otherAssetsTotal  + Number(value.value);
                });

                var assetsTotal = cashEquivalentsTotal + personalUseAssetsTotal + investedAssetsTotal + cpfSavingsTotal + otherAssetsTotal;

                $scope.displayAssetsRecords.cashEquivalentsAmt = cashEquivalentsTotal.toFixed(2);
                $scope.displayAssetsRecords.personalUseAssetsAmt = personalUseAssetsTotal.toFixed(2);
                $scope.displayAssetsRecords.investedAssetsAmt = investedAssetsTotal.toFixed(2);
                $scope.displayAssetsRecords.cpfSavingsAmt = cpfSavingsTotal.toFixed(2);
                $scope.displayAssetsRecords.otherAssetsAmt = otherAssetsTotal.toFixed(2);
                $scope.displayAssetsRecords.totalAmt = assetsTotal.toFixed(2);

                if (!$scope.user.assetsRecords) {
                    $scope.user.assetsRecords = [];
                    $scope.user.assetsRecords.push($scope.displayAssetsRecords);
                } else {
                    var recordExist = false;
                    for (var num = 0; num < $scope.user.assetsRecords.length; num++) {
                        if ($scope.user.assetsRecords[num].year === $scope.year && $scope.user.assetsRecords[num].month === $scope.month) {
                            //If exist, update	
                            $scope.user.assetsRecords[num] = $scope.displayAssetsRecords;
                            recordExist = true;
                        }
                    }
                    //else insert
                    console.log(recordExist);
                    console.log($scope.displayAssetsRecords);
                    console.log($scope.user.assetsRecords);
                    if (recordExist === false) {
                        var toInsertArr = angular.copy($scope.displayAssetsRecords);
                        toInsertArr.year = angular.copy($scope.year);
                        toInsertArr.month = angular.copy($scope.month);
                        $scope.user.assetsRecords.push(toInsertArr);
                    }
                }

                $scope.user.updatedAssets = true;
                var user = new Users($scope.user);
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


        //--DATE Selected
        var current = function() {
            $scope.dt = new Date();
        };

        current();
        var mth = [];
        mth[0] = 'January';
        mth[1] = 'February';
        mth[2] = 'March';
        mth[3] = 'April';
        mth[4] = 'May';
        mth[5] = 'June';
        mth[6] = 'July';
        mth[7] = 'August';
        mth[8] = 'September';
        mth[9] = 'October';
        mth[10] = 'November';
        mth[11] = 'December';
    
        var reloadData = function(){
            if (!$scope.user.assetsRecordsPeriod || ($scope.user.assetsRecordsPeriod.minMonth > $scope.month && $scope.user.assetsRecordsPeriod.minYear >= $scope.year) || ($scope.user.assetsRecordsPeriod.minMonth < $scope.month && $scope.user.assetsRecordsPeriod.minYear > $scope.year)) {

                $scope.displayAssetsRecords = angular.copy(AssetsService.assetsRecords);
                $scope.displayAssetsRecords.year = angular.copy($scope.year);
                $scope.displayAssetsRecords.month = angular.copy($scope.month);

            } else {

                if ($scope.user.assetsRecordsPeriod.minMonth === $scope.user.assetsRecordsPeriod.maxMonth && $scope.user.assetsRecordsPeriod.minYear === $scope.user.assetsRecordsPeriod.maxYear) {
                    $scope.displayAssetsRecords = angular.copy($scope.user.assetsRecords[0]);
                } else {
                    // IF there is multiple record

                    //TO review
                    var targetYear;
                    var targetMonth;
                    var minimumYear = $scope.user.assetsRecordsPeriod.minYear;
                    var minimumMonth = $scope.user.assetsRecordsPeriod.minMonth;
                    var maximumYear = $scope.user.assetsRecordsPeriod.maxYear;
                    var maximumMonth = $scope.user.assetsRecordsPeriod.maxMonth;

                    var latestYear = minimumYear;
                    var latestMonth = minimumMonth;

                    var latestRecord;

                    if ($scope.year > maximumYear || $scope.year === maximumYear && $scope.month >= maximumMonth) {
                        //Date after max
                        targetYear = maximumYear;
                        targetMonth = maximumMonth;
                        for (var r2 in $scope.user.assetsRecords) {
                            if ($scope.user.assetsRecords[r2].year === targetYear && $scope.user.assetsRecords[r2].month === targetMonth) {
                                latestRecord = angular.copy($scope.user.assetsRecords[r2]);
                            }
                        }
                    } else {
                        //Date in between
                        targetYear = $scope.year;
                        targetMonth = $scope.month;
                        for (var r3 in $scope.user.assetsRecords) {
                            if ($scope.user.assetsRecords[r3].year < targetYear || $scope.user.assetsRecords[r3].year === targetYear && $scope.user.assetsRecords[r3].month <= targetMonth) {
                                if ($scope.user.assetsRecords[r3].year === latestYear && $scope.user.assetsRecords[r3].month >= latestMonth) {
                                    latestRecord = angular.copy($scope.user.assetsRecords[r3]);
                                    latestMonth = angular.copy($scope.user.assetsRecords[r3].month);
                                } else if ($scope.user.assetsRecords[r3].year > latestYear) {
                                    latestRecord = angular.copy($scope.user.assetsRecords[r3]);
                                    latestMonth = angular.copy($scope.user.assetsRecords[r3].month);
                                    latestYear = angular.copy($scope.user.assetsRecords[r3].year);
                                }
                            }
                        }
                    }
                    $scope.displayAssetsRecords = latestRecord;
                }
            }

            if (!$scope.displayAssetsRecords.cashEquivalentsAmt && !$scope.displayAssetsRecords.personalUseAssetsAmt && !$scope.displayAssetsRecords.investedAssetsAmt && !$scope.displayAssetsRecords.cpfSavingsAmt && !$scope.displayAssetsRecords.otherAssetsAmt){
                $scope.assetsDoughnutData = [1];
                $scope.assetsDoughnutLabels = ['No Data'];
            } else {
                $scope.assetsDoughnutData = [$scope.displayAssetsRecords.cashEquivalentsAmt, $scope.displayAssetsRecords.personalUseAssetsAmt, $scope.displayAssetsRecords.investedAssetsAmt, $scope.displayAssetsRecords.cpfSavingsAmt, $scope.displayAssetsRecords.otherAssetsAmt]; 
                $scope.assetsDoughnutLabels = ['Cash & Cash Equivalents', 'Personal Use Assets', 'Invested Assets', 'CPF Savings', 'Other Assets'];
            }
        };

        $scope.$watch('dt', function() {
            $scope.month = $scope.dt.getMonth();
            $scope.monthDisplay = mth[$scope.month];
            $scope.year = $scope.dt.getFullYear();

            if ($scope.success || $scope.error) {
                $scope.success = false;
                $scope.error = false;
            }

            console.log($scope.user.assetsRecords);

            $scope.$watch('user', function() {
                reloadData();
            });
        });

        $scope.$watch('user', function(){
            $scope.$watch('dt', function() {
                $scope.month = $scope.dt.getMonth();
                $scope.monthDisplay = mth[$scope.month];
                $scope.year = $scope.dt.getFullYear();

                if ($scope.success || $scope.error) {
                    $scope.success = false;
                    $scope.error = false;
                }

                console.log($scope.user.assetsRecords);

                    reloadData();
            });
        });
        $scope.clear = function() {
            $scope.dt = null;
        };


        $scope.open = function($event) {
            $scope.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yyyy',
            startingDay: 1
        };
        //--DATE Selected

    }
]);