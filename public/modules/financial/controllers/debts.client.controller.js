'use strict';

// Articles controller
angular.module('financial').controller('DebtsController', ['$scope', '$rootScope', '$stateParams', '$location', 'Authentication', 'Users', '$q', 'LiabilitiesService', 'IncomeExpenseService',
    function($scope, $rootScope, $stateParams, $location, Authentication, Users, $q, LiabilitiesService, IncomeExpenseService) {
        $scope.user = Authentication.user;

        // If user is not signed in then redirect back home
        if (!$scope.user) $location.path('/');
        
        this.$setScope = function(context) {
            $scope = context;
        };

        $scope.add1show = true;
        $scope.add2show = false;

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

        //var dt = new Date('2015-10-01');
        var dt = new Date();
		var month = dt.getMonth();
		$scope.month = dt.getMonth();
        $scope.monthDisplay = $scope.mth[month];
        var year = dt.getFullYear();  
        $scope.year = dt.getFullYear();
        $scope.displayDate = $scope.mth[month]+', '+year;

        $scope.selectedYear = $scope.year;
        $scope.selectedMonth = $scope.mth[$scope.month];

        // When "Add New Debt" button is clicked
        $scope.displayIncomeExpenseRecords = angular.copy(IncomeExpenseService.incomeExpenseRecords);
        var displayLiabilitiesRecords = angular.copy(LiabilitiesService.liabilitiesRecords);
        var loanMortgageArr = displayLiabilitiesRecords.loansMortgages;
        $scope.liabilities = [];
        angular.forEach(loanMortgageArr, function(value, key){
            $scope.liabilities.push(value); 
        });

        
        $scope.$watch('selectedMonth', function() {
        	
        	$scope.selectedMonthNo = $scope.mth.indexOf($scope.selectedMonth);
        	setDebtRecord();
        	console.log($scope.selectedMonthNo);
        });
        $scope.$watch('selectedYear',function() {
        	setDebtRecord();
        });
		
		var setDebtRecord = function () {
			var debtRe = $scope.debt;
			
			//console.log(debtRe);
			var counterCheckAgn =0;
			if (typeof debtRe !== 'undefined') {
				for(var c=0; c<debtRe.records.length;c++) {
					var recordDebt = debtRe.records[c];
					if (recordDebt.year===$scope.selectedYear&&recordDebt.month===$scope.selectedMonthNo) {
						$scope.recordReq = recordDebt;
						counterCheckAgn++;
						console.log('exist?');
						$scope.noRecordsToDisplay = false;
						if ($scope.selectedYear===year&&$scope.selectedMonthNo===month) {
							$scope.presentMonthCheck = true;
							console.log('Tester');
						} else {
							$scope.presentMonthCheck = false;
						}
					}
				}
			} 
			if(counterCheckAgn===0){
				console.log('No Records');
				$scope.noRecordsToDisplay = true;
			}
		};
		
        
		
        $scope.updateRecordsForNewMonth = function () {        	

        	var needToUpdate = false;
        	//contribution status
        	for (var b = 0; b<$scope.user.debtsInfoArr.length; b++) {
        		var debtRe = $scope.user.debtsInfoArr[b];
        		debtRe.id = $scope.user.debtsInfoArr.indexOf(debtRe)+1;
        		if(debtRe.status==='In Progress') {    					    				
    			
	        		var counterCheck = 0;
	    			//debtRe.monthlyPayStatus = false;
	    			for(var c=0; c<debtRe.records.length;c++) {
	    				var recordDebt = debtRe.records[c];	    				
	    				if (recordDebt.year===year&&recordDebt.month===month) {
	    					console.log('enter or not?');
							counterCheck++;
	    				}
	    			}

	    			if(counterCheck===0) {
	    				needToUpdate = true;
	    				console.log('CREATING NEW RECORDS');
	    				var record = {
			        		month: month,
			        		year: year,
			        		loanBalance: debtRe.loanBalance,
			        		monthly: 0,
			        		monthlyPayStatus: false,
			        		repaymentNo: debtRe.repaymentNo
			        	};        
			        	        	
			        	debtRe.records.push(record);


	    				if (($scope.user.liabilitiesRecordsPeriod.maxMonth <= month && $scope.user.liabilitiesRecordsPeriod.maxYear <= year) || ($scope.user.liabilitiesRecordsPeriod.maxMonth > month && $scope.user.liabilitiesRecordsPeriod.maxYear < year)) {

			        		$scope.user.liabilitiesRecordsPeriod.maxMonth = month;
			                $scope.user.liabilitiesRecordsPeriod.maxYear = year;
			        	} 

		        	 	//Existing record but no record of that month
		                var existenceCheck = 0;
		                for (var j=0;j<$scope.user.liabilitiesRecords.length; j++) {   
		                    var recordChecker = $scope.user.liabilitiesRecords[j];                                                         
		                    if (recordChecker.month===month&&recordChecker.year===year) {
		                        existenceCheck++;
		                        console.log('2nd');
		                    }
		                }
		                if (existenceCheck===0) {
		                    displayLiabilitiesRecords.year = year;
		                    displayLiabilitiesRecords.month = month;                                
		                    $scope.user.liabilitiesRecords.push(displayLiabilitiesRecords);  
		                    console.log('3rd');
		                }
			            

						for(var i=0;i<$scope.user.liabilitiesRecords.length; i++) {            
			                var liabilityRecord = $scope.user.liabilitiesRecords[i];  

			            	if (liabilityRecord.month===month&&liabilityRecord.year===year) {
			            		var loansMortgagesRec = liabilityRecord.loansMortgages;

			            		//update new loan balance
			            		for (var get in loansMortgagesRec) {                        
			                        var obj = loansMortgagesRec[get];
			                        if(debtRe.type=== obj.description) {
			                        	obj.value += debtRe.loanBalance;
			                        	obj.minValue += debtRe.loanBalance;
			                        }
			                    }
			                	
			                	//update totals
			            	    var shortTermCreditArr = liabilityRecord.shortTermCredit;
				                var shortTermCreditTotal = 0;
				                for (var rt in shortTermCreditArr) {
				                    var obj1 = shortTermCreditArr[rt];
				                    shortTermCreditTotal += obj1.value;
				                }
				                
				                var loansMortgagesArr = liabilityRecord.loansMortgages;
				                var loansMortgagesTotal = 0;
				                for (var rt1 in loansMortgagesArr) {
				                    var obj2 = loansMortgagesArr[rt1];
				                    loansMortgagesTotal += obj2.value;
				                }
				                
				                var otherLiabilitiesArr = liabilityRecord.otherLiabilities;
				                var otherLiabilitiesTotal = 0;
				                for (var rt2 in otherLiabilitiesArr) {
				                    var obj3 = otherLiabilitiesArr[rt2];
				                    otherLiabilitiesTotal += obj3.value;
				                }
				                
				                var liabilitiesTotal = shortTermCreditTotal + loansMortgagesTotal + otherLiabilitiesTotal;

				                liabilityRecord.shortTermCreditAmt = shortTermCreditTotal.toFixed(2);
				                liabilityRecord.loansMortgagesAmt = loansMortgagesTotal.toFixed(2);
				                liabilityRecord.otherLiabilitiesAmt = otherLiabilitiesTotal.toFixed(2);
				                liabilityRecord.totalAmt = liabilitiesTotal.toFixed(2);
			            	}
			            }
	    			}
	    		}    			
        	}
        	console.log(needToUpdate);
        	if (needToUpdate) {
				var userNow = new Users($scope.user);
	            userNow.$update(function(response) {
	                $scope.success = true;
	                Authentication.user = response;
	                $scope.user = Authentication.user;
	            }, function(response) {
	                $scope.error = response.data.message;
	            });
	            console.log('logic works');
			}
        };
        $scope.updateRecordsForNewMonth();

        $scope.contributionModal = function (debt) {
        	$scope.debtDetails = true;
        	$scope.contributionConfirm = false;
        	$scope.success = false;
        	$scope.debt = debt;

        	var debtRe = $scope.debt;
			//console.log(debtRe);
			console.log($scope.selectedYear);
			console.log($scope.selectedMonth);
			for(var c=0; c<debtRe.records.length;c++) {
				var recordDebt = debtRe.records[c];
				if (recordDebt.year===$scope.selectedYear&&recordDebt.month===$scope.selectedMonthNo) {
					$scope.recordReq = recordDebt;
					console.log($scope.recordReq);
					$scope.noRecordsToDisplay = false;
					$scope.presentMonthCheck = true;
					
				}
			}
			       	        	
        };

        $scope.contribute = function() {
        	$scope.debtDetails = false;
        	$scope.contributionConfirm = true;         	
        };

        $scope.confirmContribute = function() {
        	
        	var expenseChecker;
        	if ($scope.debt.linkedStatus==='Yes') {
        		//Update LIABILITIES
	        	for(var j=0;j<$scope.user.liabilitiesRecords.length; j++) {            
	                var liabilityRecord = $scope.user.liabilitiesRecords[j];  

	            	if (liabilityRecord.month===month&&liabilityRecord.year===year) {
	            		var loansMortgagesRec = liabilityRecord.loansMortgages;

	            		//update new loan balance
	            		for (var get in loansMortgagesRec) {                        
	                        var obj = loansMortgagesRec[get];
	                        if($scope.debt.type=== obj.description) {
	                        	obj.value -= $scope.debt.monthly;
	                        	obj.minValue -= $scope.debt.monthly;
	                        }
	                    }
	                	
	                	//update totals
	            	    var shortTermCreditArr = liabilityRecord.shortTermCredit;
		                var shortTermCreditTotal = 0;
		                for (var rt in shortTermCreditArr) {
		                    var obj1 = shortTermCreditArr[rt];
		                    shortTermCreditTotal += obj1.value;
		                }
		                
		                var loansMortgagesArr = liabilityRecord.loansMortgages;
		                var loansMortgagesTotal = 0;
		                for (var rt1 in loansMortgagesArr) {
		                    var obj2 = loansMortgagesArr[rt1];
		                    loansMortgagesTotal += obj2.value;
		                }
		                
		                var otherLiabilitiesArr = liabilityRecord.otherLiabilities;
		                var otherLiabilitiesTotal = 0;
		                for (var rt2 in otherLiabilitiesArr) {
		                    var obj3 = otherLiabilitiesArr[rt2];
		                    otherLiabilitiesTotal += obj3.value;
		                }
		                
		                var liabilitiesTotal = shortTermCreditTotal + loansMortgagesTotal + otherLiabilitiesTotal;

		                liabilityRecord.shortTermCreditAmt = shortTermCreditTotal.toFixed(2);
		                liabilityRecord.loansMortgagesAmt = loansMortgagesTotal.toFixed(2);
		                liabilityRecord.otherLiabilitiesAmt = otherLiabilitiesTotal.toFixed(2);
		                liabilityRecord.totalAmt = liabilitiesTotal.toFixed(2);
	            	}
	            }

	            //Update INCOME&EXPENSE
	            if (!$scope.user.incomeExpenseRecordsPeriod) {
                	//If there is no existing record
	                console.log('do you enter?');
	                $scope.user.incomeExpenseRecordsPeriod = {};
	                $scope.user.incomeExpenseRecordsPeriod.minMonth = month;
	                $scope.user.incomeExpenseRecordsPeriod.minYear = year;
	                $scope.user.incomeExpenseRecordsPeriod.maxMonth = month;
	                $scope.user.incomeExpenseRecordsPeriod.maxYear = year;                

	            } else if (($scope.user.incomeExpenseRecordsPeriod.maxMonth <= month && $scope.user.incomeExpenseRecordsPeriod.maxYear <= year) || ($scope.user.incomeExpenseRecordsPeriod.maxMonth > month && $scope.user.incomeExpenseRecordsPeriod.maxYear < year)) {

	                console.log('do you enter2?');
	                //ASSUMING THAT THE USER NEVER INSERTS DATA FOR THE FUTURE (HE CANT POSSIBLY DO SO ALSO)
	                //SETS RECORDS MAX PERIOD TO PRESENT MONTH & YEAR
	                //I ALSO CURRENTLY DONT ALLOW USERS TO SET BUDGET FOR THE FUTURE (ONLY FOR PRESENT MONTH)
	                $scope.user.incomeExpenseRecordsPeriod.maxMonth = month;
	                $scope.user.incomeExpenseRecordsPeriod.maxYear = year;
	            }

	             
	            
	            if($scope.user.incomeExpenseRecords.length===0) { //in the event of an empty record (FIRSTTIME)                
	                console.log('1st');
	                $scope.displayIncomeExpenseRecords.year = year;
	                $scope.displayIncomeExpenseRecords.month = month;                                
	                $scope.user.incomeExpenseRecords.push($scope.displayIncomeExpenseRecords); 
	            } else { //Existing record but no record of that month
	                var existenceCheck = 0;
	                for (var k=0;k<$scope.user.incomeExpenseRecords.length; k++) {   
	                    var recordChecker = $scope.user.incomeExpenseRecords[k];                                                         
	                    if (recordChecker.month===month&&recordChecker.year===year) {
	                        existenceCheck++;
	                        console.log('2nd');
	                    }
	                }
	                if (existenceCheck===0) {
	                    $scope.displayIncomeExpenseRecords.year = year;
	                    $scope.displayIncomeExpenseRecords.month = month;                                
	                    $scope.user.incomeExpenseRecords.push($scope.displayIncomeExpenseRecords);  
	                    console.log('3rd');
	                }
	            }

	            for(var a=0;a<$scope.user.incomeExpenseRecords.length; a++) {            
	                var expenseRecord = $scope.user.incomeExpenseRecords[a];  

	                if (expenseRecord.month===month&&expenseRecord.year===year) {
	                    
	                    var thisMonthSpecExpense = {};
	                    console.log('DIE HERE');
	                    if($scope.debt.type!=='Car Loan') {                        
	                    	thisMonthSpecExpense = expenseRecord.monthlyExpense.fixedExpense;
	                   
		                    for (var get10 in thisMonthSpecExpense) {                        
		                        var obj10 = thisMonthSpecExpense[get10];
		                        if($scope.debt.type === 'Mortgage Loan' && obj10.description==='Mortgage Repayments') {        	
		                            console.log('SUCCESS');
		                            //need validation
		                            obj10.value += $scope.debt.monthly;	
		                            expenseChecker = obj10.description;                            
		                        } else if($scope.debt.type !== 'Mortgage Loan' && obj10.description==='Other Loan Repayments') {
		                        	obj10.value += $scope.debt.monthly;
		                        	expenseChecker = obj10.description;
	                    		}
	                    	}	

                    	} else {
	                        thisMonthSpecExpense = expenseRecord.monthlyExpense.transport;
	                        for (var get11 in thisMonthSpecExpense) {                        
		                        var obj11 = thisMonthSpecExpense[get11];
		                        if(obj11.description==='Car Loan Repayments') {        	
		                            console.log('SUCCESS');
		                            //need validation
		                            obj11.value += $scope.debt.monthly;
		                            expenseChecker = obj11.description;	                            
		                        } 
	                    	}
	                    }
                        var fixedExpenseArr = expenseRecord.monthlyExpense.fixedExpense;
		                var fixedExpenseTotal = 0;
		                for (var at in fixedExpenseArr) {
		                    var abj1 = fixedExpenseArr[at];
		                    fixedExpenseTotal += abj1.value;
		                }
		                expenseRecord.fixedExpenseAmt = fixedExpenseTotal.toFixed(2);

		                var transportArr = expenseRecord.monthlyExpense.transport;
		                var transportTotal = 0;
		                for (var at1 in transportArr) {
		                    var abj2 = transportArr[at1];
		                    transportTotal += abj2.value;
		                }
		                expenseRecord.transportAmt = transportTotal.toFixed(2);

		                var utilityHouseholdArr = expenseRecord.monthlyExpense.utilityHousehold;
		                var utilityHouseholdTotal = 0;
		                for (var at2 in utilityHouseholdArr) {
		                    var abj3 = utilityHouseholdArr[at2];
		                    utilityHouseholdTotal += abj3.value;
		                }
		                expenseRecord.utilityHouseholdAmt = utilityHouseholdTotal.toFixed(2);

		                var foodNecessitiesArr = expenseRecord.monthlyExpense.foodNecessities;
		                var foodNecessitiesTotal = 0;
		                for (var at3 in foodNecessitiesArr) {
		                    var abj4 = foodNecessitiesArr[at3];
		                    foodNecessitiesTotal += abj4.value;
		                }
		                expenseRecord.foodNecessitiesAmt = foodNecessitiesTotal.toFixed(2);

		                var miscArr = expenseRecord.monthlyExpense.misc;
		                var miscTotal = 0;
		                for (var at4 in miscArr) {
		                    var abj5 = miscArr[at4];
		                    miscTotal += abj5.value;
		                }
		                expenseRecord.miscAmt = miscTotal.toFixed(2);

		                var monthlyIncomeAmt = Number(expenseRecord.monthlyIncomeAmt);                
		                var monthlyExpenseAmt = fixedExpenseTotal + transportTotal + utilityHouseholdTotal + foodNecessitiesTotal + miscTotal;
		                var netCashFlow = monthlyIncomeAmt - monthlyExpenseAmt;                
		                expenseRecord.monthlyIncomeAmt = monthlyIncomeAmt.toFixed(2);                
		                expenseRecord.monthlyExpenseAmt = monthlyExpenseAmt.toFixed(2);
		                expenseRecord.netCashFlow = netCashFlow.toFixed(2);
                    
					}
				}      

			}

			for (var i = 0; i<$scope.user.debtsInfoArr.length; i++) {
        		var debtRe = $scope.user.debtsInfoArr[i];
        		if(debtRe.lender===$scope.debt.lender&&debtRe.amt===$scope.debt.amt) {
        			//part to change
        			debtRe.loanBalance -= debtRe.monthly;
        			debtRe.repaymentNo += 1;
        			//debtRe.monthlyPayStatus = true;
    				/*
        			var newRecord = {
        				month: month,
        				year: year,
        				monthly: debtRe.monthly,
        				loanBalance: debtRe.loanBalance,
        				expenseType: expenseChecker 
        			};
					*/
        			for(var c=0; c<debtRe.records.length;c++) {
    					var recordDebt = debtRe.records[c];
	    				if (recordDebt.year===year&&recordDebt.month===month) {
	    					console.log('Working so far');
	    					recordDebt.monthly = debtRe.monthly;
	    					recordDebt.expenseType = expenseChecker;
	    					recordDebt.loanBalance =debtRe.loanBalance;
	    					recordDebt.monthlyPayStatus = true;
	    					recordDebt.repaymentNo = debtRe.repaymentNo;
	    				}
    				} 
    				if(debtRe.loanBalance===0) {
    					debtRe.status = 'Completed';
    					debtRe.statusBoolean = true;
    				}
        			       	
        		}
        	}
        	$scope.debt.monthlyPayStatus = true;

			var userNow = new Users($scope.user);
            userNow.$update(function(response) {
                $scope.success = true;
                Authentication.user = response;
                $scope.user = Authentication.user;
            }, function(response) {
                $scope.error = response.data.message;
            });

            $scope.contributionConfirm = false;
            $scope.success = true;
            $scope.debt = null;
        };

        $scope.addDebtOne = function () {
        	

        	$scope.loanBalance = ($scope.newDebt.monthly*$scope.newDebt.lenOfLoan) - ($scope.newDebt.monthly*$scope.newDebt.repaymentNo);
        	if ($scope.loanBalance<=0) {
        		$scope.loanBalance = 0;
        		alert('Check inputs again!');
        	}
        	else { 
	        	$scope.displayLoanBalance = $scope.loanBalance.toFixed(2);
	        	$scope.newDebt.loanBalance = $scope.loanBalance;
	        	console.log($scope.newDebt);
	        	$scope.add1show = false;
	        	$scope.add2show = true;
        	}
        };

        $scope.setNewLoanBalance = function() {
        	$scope.loanBalance = $scope.newLoanBalance;
			console.log('TESTER');
        	$scope.displayLoanBalance = $scope.loanBalance.toFixed(2);
	        $scope.newDebt.loanBalance = $scope.loanBalance;
        };

        $scope.createNoLinkedDebt = function() {
        	$scope.newDebt.linkedStatus = 'No';
        	//$scope.newDebt.monthlyPayStatus = false;
        	$scope.newDebt.status = 'In Progress';
        	$scope.newDebt.statusBoolean = false;
        	$scope.newDebt.id = $scope.user.debtsInfoArr.length + 1;
        	$scope.newDebt.creationRecord = {
        		month: month,
        		year: year,
        		loanBalance: $scope.newDebt.loanBalance,
        		repaymentNo: $scope.newDebt.repaymentNo
        	};
			$scope.newDebt.records = [];
			var record = {
        		month: month,
        		year: year,
        		loanBalance: $scope.newDebt.loanBalance,
        		monthly: 0,
        		monthlyPayStatus: false,
        		repaymentNo: $scope.newDebt.repaymentNo
        	};
        	$scope.newDebt.records.push(record);
        	$scope.user.debtsInfoArr.push($scope.newDebt);

        	var userNow = new Users($scope.user);
            userNow.$update(function(response) {
                $scope.success = true;
                Authentication.user = response;
                $scope.user = Authentication.user;
            }, function(response) {
                $scope.error = response.data.message;
            });
            $scope.add2show = false;
            $scope.add3show = true;
        };

        $scope.createLinkedDebt = function () {        
        	console.log($scope.newDebt.loanBalance);
        	$scope.newDebt.linkedStatus = 'Yes';
        	$scope.newDebt.status = 'In Progress';
        	$scope.newDebt.statusBoolean = false;
        	//$scope.newDebt.monthlyPayStatus = false;
        	$scope.newDebt.id = $scope.user.debtsInfoArr.length + 1;
        	$scope.newDebt.creationRecord = {
        		month: month,
        		year: year,
        		loanBalance: $scope.newDebt.loanBalance,
        		repaymentNo: $scope.newDebt.repaymentNo
        	};
        	$scope.newDebt.records = [];
        	
        	var record = {
        		month: month,
        		year: year,
        		loanBalance: $scope.newDebt.loanBalance,
        		monthly: 0,
        		monthlyPayStatus: false,
        		repaymentNo: $scope.newDebt.repaymentNo
        	};        
        	        	
        	$scope.newDebt.records.push(record);
        	
        	$scope.user.debtsInfoArr.push($scope.newDebt);

        	console.log(month);
        	console.log(year);
        	//creating new liabilities record period
        	if(!$scope.user.liabilitiesRecordsPeriod) {
        		$scope.user.liabilitiesRecordsPeriod = {};
        		$scope.user.liabilitiesRecordsPeriod.minMonth = month;
                $scope.user.liabilitiesRecordsPeriod.minYear = year;
                $scope.user.liabilitiesRecordsPeriod.maxMonth = month;
                $scope.user.liabilitiesRecordsPeriod.maxYear = year; 
        	}
        	else if (($scope.user.liabilitiesRecordsPeriod.maxMonth <= month && $scope.user.liabilitiesRecordsPeriod.maxYear <= year) || ($scope.user.liabilitiesRecordsPeriod.maxMonth > month && $scope.user.liabilitiesRecordsPeriod.maxYear < year)) {

        		$scope.user.liabilitiesRecordsPeriod.maxMonth = month;
                $scope.user.liabilitiesRecordsPeriod.maxYear = year;
        	} 

        	if($scope.user.liabilitiesRecords.length===0) { //in the event of an empty record (FIRSTTIME)                
                console.log('1st');
                displayLiabilitiesRecords.year = year;
                displayLiabilitiesRecords.month = month;                                                
                $scope.user.liabilitiesRecords.push(displayLiabilitiesRecords); 
            } else { //Existing record but no record of that month
                var existenceCheck = 0;
                for (var j=0;j<$scope.user.liabilitiesRecords.length; j++) {   
                    var recordChecker = $scope.user.liabilitiesRecords[j];                                                         
                    if (recordChecker.month===month&&recordChecker.year===year) {
                        existenceCheck++;
                        console.log('2nd');
                    }
                }
                if (existenceCheck===0) {
                    displayLiabilitiesRecords.year = year;
                    displayLiabilitiesRecords.month = month;                                
                    $scope.user.liabilitiesRecords.push(displayLiabilitiesRecords);  
                    console.log('3rd');
                }
            }

			for(var i=0;i<$scope.user.liabilitiesRecords.length; i++) {            
                var liabilityRecord = $scope.user.liabilitiesRecords[i];  

            	if (liabilityRecord.month===month&&liabilityRecord.year===year) {
            		var loansMortgagesRec = liabilityRecord.loansMortgages;

            		//update new loan balance
            		for (var get in loansMortgagesRec) {                        
                        var obj = loansMortgagesRec[get];
                        if($scope.newDebt.type=== obj.description) {
                        	obj.value += $scope.newDebt.loanBalance;
                        	obj.minValue += $scope.newDebt.loanBalance;
                        }
                    }
                	
                	//update totals
            	    var shortTermCreditArr = liabilityRecord.shortTermCredit;
	                var shortTermCreditTotal = 0;
	                for (var rt in shortTermCreditArr) {
	                    var obj1 = shortTermCreditArr[rt];
	                    shortTermCreditTotal += obj1.value;
	                }
	                
	                var loansMortgagesArr = liabilityRecord.loansMortgages;
	                var loansMortgagesTotal = 0;
	                for (var rt1 in loansMortgagesArr) {
	                    var obj2 = loansMortgagesArr[rt1];
	                    loansMortgagesTotal += obj2.value;
	                }
	                
	                var otherLiabilitiesArr = liabilityRecord.otherLiabilities;
	                var otherLiabilitiesTotal = 0;
	                for (var rt2 in otherLiabilitiesArr) {
	                    var obj3 = otherLiabilitiesArr[rt2];
	                    otherLiabilitiesTotal += obj3.value;
	                }
	                
	                var liabilitiesTotal = shortTermCreditTotal + loansMortgagesTotal + otherLiabilitiesTotal;

	                liabilityRecord.shortTermCreditAmt = shortTermCreditTotal.toFixed(2);
	                liabilityRecord.loansMortgagesAmt = loansMortgagesTotal.toFixed(2);
	                liabilityRecord.otherLiabilitiesAmt = otherLiabilitiesTotal.toFixed(2);
	                liabilityRecord.totalAmt = liabilitiesTotal.toFixed(2);
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
            $scope.add2show = false;
            $scope.add3show = true;
        };

        $scope.resetModal = function() {
        	$scope.add1show = true;
	        $scope.add2show = false;
	        $scope.add3show = false;
	        $scope.newDebt = null;
        };

        $scope.previousModal1 = function() {
        	$scope.add1show = true;
        	$scope.add2show = false;
        };

        $scope.selectDeleteRecord = function(debt) {
        	$scope.debt = debt;
        };

		$scope.deleteRecord = function() {
		 	
		 
		 	$scope.showAdd = false;
		  	var index = $scope.user.debtsInfoArr.indexOf($scope.debt);
		  	$scope.user.debtsInfoArr.splice(index, 1);

		  	for (var b = 0; b<$scope.user.debtsInfoArr.length; b++) {
        		var debtRe = $scope.user.debtsInfoArr[b];
        		debtRe.id = $scope.user.debtsInfoArr.indexOf(debtRe)+1;
        	}
        	
		  	var user = new Users($scope.user);
	        user.$update(function(response) {
	            $scope.success = true;

	            Authentication.user = response;
	            $scope.user = Authentication.user;
	        }, function(response) {
	            $scope.error = response.data.message;
	        });
		
		};

		$scope.cancel = function() {
		  	$scope.showAdd = false;
		  	$scope.selectedDebtRecord = null;
		 	
		};

    }
]);
