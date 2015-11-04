'use strict';

// Articles controller
angular.module('financial').controller('InsurancesController', ['$scope', '$rootScope', '$stateParams', '$location', 'Authentication',  'Users', '$q', 'AssetsService',
	function($scope, $rootScope, $stateParams, $location, Authentication, Users, $q, AssetsService) {
		$scope.user = Authentication.user;
        //Check for authentication
        if (!$scope.user) $location.path('/');

        this.$setScope = function(context) {
            $scope = context;
        };

        var dt = new Date();
        $scope.year = dt.getFullYear();
        $scope.month = dt.getMonth();

        $scope.displayAssetsRecords = angular.copy(AssetsService.assetsRecords);

        var loadPolicies = function() {
            $scope.displayInsuranceInfo = angular.copy($scope.user.insurancesInfoArr);    
        };
        loadPolicies();        

        $scope.viewModal = function(insurance) {
            $scope.insurance = insurance;            
        };
        
        $scope.addNewPolicy = function() {
            $scope.insurance.id = $scope.user.insurancesInfoArr.length+1;
            $scope.insurance.year = $scope.selectedYear; //starts only from this year
            $scope.user.insurancesInfoArr.push($scope.insurance);

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

            if ($scope.user.assetsRecords.length===0) {
                $scope.displayAssetsRecords.year = $scope.year;
                $scope.displayAssetsRecords.month = $scope.month;
                $scope.user.assetsRecords.push($scope.displayAssetsRecords);
            } else {
                var existenceCheck = 0;
                for (var j=0;j<$scope.user.assetsRecords.length; j++) {   
                    var recordChecker = $scope.user.assetsRecords[j];                                                         
                    if (recordChecker.month===$scope.month&&recordChecker.year===$scope.year) {
                        existenceCheck++;
                        console.log('2nd');
                    }
                }
                if (existenceCheck===0) {
                    $scope.displayAssetsRecords.year = $scope.year;
                    $scope.displayAssetsRecords.month = $scope.month;                                
                    $scope.user.assetsRecords.push($scope.displayAssetsRecords);  
                    console.log('3rd');
                }
            }

            for(var i=0;i<$scope.user.assetsRecords.length; i++) {            
                var assetRecord = $scope.user.assetsRecords[i];  
                console.log('hello');
                if (assetRecord.month===$scope.month&&assetRecord.year===$scope.year) {
                    var specAsset;
                    if ($scope.insurance.term==='Life') {
                        specAsset = assetRecord.investedAssets.lifeInsurance;
                    }
                    else if ($scope.insurance.term==='Investment') {
                        specAsset = assetRecord.investedAssets.investmentInsurance;
                    } else {
                        specAsset = assetRecord.investedAssets.others;
                    }
                    
                    var critical = $scope.insurance.coverage.critical;
                    var death = $scope.insurance.coverage.death;
                    var accident = $scope.insurance.coverage.accident;
                    var hospitalization =$scope.insurance.coverage.hospitalization;
                    var reimbursement =$scope.insurance.coverage.reimbursement;
                    var disability = $scope.insurance.coverage.disability;
                    var hospitalIncome = $scope.insurance.coverage.hospitalIncome;

                    if(typeof $scope.insurance.coverage.critical ==='undefined') {
                        critical = 0;
                    }
                    if(typeof $scope.insurance.coverage.death ==='undefined') {
                        death = 0;
                    }
                    if(typeof $scope.insurance.coverage.accident ==='undefined') {
                        accident = 0;
                    }
                    if(typeof $scope.insurance.coverage.hospitalization ==='undefined') {
                        hospitalization = 0;
                    }
                    if(typeof $scope.insurance.coverage.reimbursement ==='undefined') {
                        reimbursement = 0;
                    }
                    if(typeof $scope.insurance.coverage.disability ==='undefined') {
                        disability = 0;
                    }
                    if(typeof $scope.insurance.coverage.hospitalIncome ==='undefined') {
                        hospitalIncome = 0;
                    }

                    var total = critical+death+accident+hospitalization+reimbursement+disability+hospitalIncome;
                    specAsset.value += total;
                    specAsset.minValue += total;
                    $scope.insurance.totalTracker = total;
                    /*
                    for (var get in thisMonthSpecExpense) {                        
                        var obj = thisMonthSpecExpense[get];
                        if($scope.type=== obj.description) {
                            console.log('SUCCESS');
                            obj.recordsTotal += $scope.expenseAmt;
                            obj.records.push(record);
                            if (obj.recordsTotal>=obj.value) {
                                obj.value = obj.recordsTotal;
                            }
                        }
                    }
                    */
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

            var userNow = new Users($scope.user);
            userNow.$update(function(response) {
                $scope.success = true;
                Authentication.user = response;
                $scope.user = Authentication.user;
            }, function(response) {
                $scope.error = response.data.message;
            });

            $scope.success = true;
            loadPolicies();
        };

        $scope.editModal = function (insurance) {                                   

            for (var i = 0; i<$scope.user.insurancesInfoArr.length; i++) {
                if($scope.user.insurancesInfoArr[i].id===insurance.id) {
                    $scope.insurance = angular.copy($scope.user.insurancesInfoArr[i]);                    
                }
            }
        };

        $scope.editPolicy = function() {
            if ($scope.editForm.$dirty) {

                var original;
                var assetRecord;
                for (var b = 0; b<$scope.user.insurancesInfoArr.length; b++) {
                    if($scope.user.insurancesInfoArr[b].id===$scope.insurance.id) {
                        original  = $scope.user.insurancesInfoArr[b];                    
                    }
                }
                
                for(var i=0;i<$scope.user.assetsRecords.length; i++) {

                    assetRecord = $scope.user.assetsRecords[i];  
                    console.log('hello');

                    if (assetRecord.month===$scope.month&&assetRecord.year===$scope.year) {
                        
                        //Remove first
                        var specAssetOriginal;
                        console.log(original.term);
                        if (original.term==='Life') {
                            specAssetOriginal = assetRecord.investedAssets.lifeInsurance;
                            console.log('should enter right');

                        }
                        else if (original.term==='Investment') {
                            specAssetOriginal = assetRecord.investedAssets.investmentInsurance;
                            
                        } else {
                            specAssetOriginal = assetRecord.investedAssets.others;
                            
                        }
                        

                        //var total = critical+death+accident+hospitalization+reimbursement+disability+hospitalIncome;
                        specAssetOriginal.value -= original.totalTracker;
                        specAssetOriginal.minValue -= original.totalTracker;
                        console.log('What? '+specAssetOriginal.value);
                        //$scope.insurance.totalTracker = total;

                        //Add

                        var specAsset;
                        if ($scope.insurance.term==='Life') {
                            specAsset = assetRecord.investedAssets.lifeInsurance;
                            console.log('Should enter 2');
                        }
                        else if ($scope.insurance.term==='Investment') {
                            specAsset = assetRecord.investedAssets.investmentInsurance;
                        } else {
                            specAsset = assetRecord.investedAssets.others;
                        }
                        
                        var critical = $scope.insurance.coverage.critical;
                        var death = $scope.insurance.coverage.death;
                        var accident = $scope.insurance.coverage.accident;
                        var hospitalization =$scope.insurance.coverage.hospitalization;
                        var reimbursement =$scope.insurance.coverage.reimbursement;
                        var disability = $scope.insurance.coverage.disability;
                        var hospitalIncome = $scope.insurance.coverage.hospitalIncome;

                        if(typeof $scope.insurance.coverage.critical ==='undefined') {
                            critical = 0;
                        }
                        if(typeof $scope.insurance.coverage.death ==='undefined') {
                            death = 0;
                        }
                        if(typeof $scope.insurance.coverage.accident ==='undefined') {
                            accident = 0;
                        }
                        if(typeof $scope.insurance.coverage.hospitalization ==='undefined') {
                            hospitalization = 0;
                        }
                        if(typeof $scope.insurance.coverage.reimbursement ==='undefined') {
                            reimbursement = 0;
                        }
                        if(typeof $scope.insurance.coverage.disability ==='undefined') {
                            disability = 0;
                        }
                        if(typeof $scope.insurance.coverage.hospitalIncome ==='undefined') {
                            hospitalIncome = 0;
                        }

                        var total = critical+death+accident+hospitalization+reimbursement+disability+hospitalIncome;
                        specAsset.value += total;
                        specAsset.minValue += total;
                        $scope.insurance.totalTracker = total;
                        /*
                        for (var get in thisMonthSpecExpense) {                        
                            var obj = thisMonthSpecExpense[get];
                            if($scope.type=== obj.description) {
                                console.log('SUCCESS');
                                obj.recordsTotal += $scope.expenseAmt;
                                obj.records.push(record);
                                if (obj.recordsTotal>=obj.value) {
                                    obj.value = obj.recordsTotal;
                                }
                            }
                        }
                        */
                    }
                }
                var cashEquivalentsArr = assetRecord.cashEquivalents;
                var cashEquivalentsTotal = 0;
                angular.forEach(cashEquivalentsArr, function(value, key){
                    cashEquivalentsTotal = cashEquivalentsTotal + Number(value.value);
                });

                var personalUseAssetsArr = assetRecord.personalUseAssets;
                var personalUseAssetsTotal = 0;
                angular.forEach(personalUseAssetsArr, function(value, key){
                    personalUseAssetsTotal = personalUseAssetsTotal + Number(value.value);
                });

                var investedAssetsArr = assetRecord.investedAssets;
                var investedAssetsTotal = 0;
                angular.forEach(investedAssetsArr, function(value, key){
                    investedAssetsTotal = investedAssetsTotal + Number(value.value);
                    console.log(value.value);
                });

                var cpfSavingsArr = assetRecord.cpfSavings;
                var cpfSavingsTotal = 0;
                angular.forEach(cpfSavingsArr, function(value, key){
                    cpfSavingsTotal = cpfSavingsTotal + Number(value.value);
                });

                var otherAssetsArr = assetRecord.otherAssets;
                var otherAssetsTotal = 0;
                angular.forEach(otherAssetsArr, function(value, key){
                    otherAssetsTotal = otherAssetsTotal  + Number(value.value);
                });

                var assetsTotal = cashEquivalentsTotal + personalUseAssetsTotal + investedAssetsTotal + cpfSavingsTotal + otherAssetsTotal;

                assetRecord.cashEquivalentsAmt = cashEquivalentsTotal.toFixed(2);
                assetRecord.personalUseAssetsAmt = personalUseAssetsTotal.toFixed(2);
                assetRecord.investedAssetsAmt = investedAssetsTotal.toFixed(2);
                assetRecord.cpfSavingsAmt = cpfSavingsTotal.toFixed(2);
                assetRecord.otherAssetsAmt = otherAssetsTotal.toFixed(2);
                assetRecord.totalAmt = assetsTotal.toFixed(2);

                for (var a = 0; a<$scope.user.insurancesInfoArr.length; a++) {
                    if($scope.user.insurancesInfoArr[a].id===$scope.insurance.id) {
                        $scope.user.insurancesInfoArr[a] = $scope.insurance;
                    }
                }

                var userNow = new Users($scope.user);
                userNow.$update(function(response) {
                    $scope.success = true;
                    Authentication.user = response;
                    $scope.user = Authentication.user;
                }, function(response) {
                    $scope.error = response.data.message;
                });

                $scope.success = true;
                loadPolicies(); 
                $scope.editForm.$setPristine();           
            } else {
                $scope.error = 'No Changes Detected';
            }
        };

        $scope.deleteModal = function(insurance) {
            $scope.insurance = insurance;
        };

        $scope.deletePolicy = function() {

            var index = $scope.user.insurancesInfoArr.indexOf($scope.insurance);
            $scope.user.insurancesInfoArr.splice(index, 1);

            for (var b = 0; b<$scope.user.insurancesInfoArr.length; b++) {
                var insuranceRe = $scope.user.insurancesInfoArr[b];
                insuranceRe.id = $scope.user.insurancesInfoArr.indexOf(insuranceRe)+1;
            }
            
            var user = new Users($scope.user);
            user.$update(function(response) {
                $scope.success = true;

                Authentication.user = response;
                $scope.user = Authentication.user;
            }, function(response) {
                $scope.error = response.data.message;
            });
            $scope.success = true;
            loadPolicies();
        };

        $scope.cancel = function() {
            $scope.success = false;
            $scope.insurance = null;
            $scope.error = '';
        };

	}
]);