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

  		var dt = new Date();
      	// var dt = new Date(2016,1,25);
        
		var month = dt.getMonth();
		$scope.month = dt.getMonth();
        $scope.monthDisplay = $scope.mth[month];
        var year = dt.getFullYear();  
        $scope.year = dt.getFullYear();
        $scope.displayDate = $scope.mth[month]+', '+year;

        // When "Add New Debt" button is clicked
        $scope.displayIncomeExpenseRecords = angular.copy(IncomeExpenseService.incomeExpenseRecords);
        var displayLiabilitiesRecords = angular.copy(LiabilitiesService.liabilitiesRecords);
        var loanMortgageArr = displayLiabilitiesRecords.loansMortgages;
        $scope.liabilities = [];
        angular.forEach(loanMortgageArr, function(value, key){
            $scope.liabilities.push(value); 
        });
        $scope.newDebt = {};
        var monthPartString;
        var datePartString;
        if (((dt.getMonth()+1).toString()).length===1) {
            monthPartString = '-0'+(dt.getMonth()+1);
        } else {
            monthPartString = '-'+(dt.getMonth()+1);
        }
        if ((dt.getDate().toString()).length===1) {
            datePartString = '-0'+dt.getDate();
        } else {
            datePartString = '-'+dt.getDate();
        }
        $scope.newDebt.startDate = dt.getFullYear()+monthPartString+datePartString;
        /*
        $scope.$watch('selectedMonth', function() {
        	
        	$scope.selectedMonthNo = $scope.mth.indexOf($scope.selectedMonth);
        	setDebtRecord();
        	
        });
        $scope.$watch('selectedYear',function() {
        	setDebtRecord();
        });
		*/
        var dateFormatter = function(date) {
            var mth = [];
            mth[0] = 'Jan';
            mth[1] = 'Feb';
            mth[2] = 'Mar';
            mth[3] = 'Apr';
            mth[4] = 'May';
            mth[5] = 'Jun';
            mth[6] = 'Jul';
            mth[7] = 'Aug';
            mth[8] = 'Sept';
            mth[9] = 'Oct';
            mth[10] = 'Nov';
            mth[11] = 'Dec';
            var monthString = mth[date.getMonth()];
            var dateString = date.getDate();
            var yearString = date.getYear()+1900;
            var final_String = dateString+'-'+monthString+'-'+yearString;
            return final_String;
        };
		
		var setDebtRecord = function () {
			var debtRe = $scope.debt;
			
			//
			var counterCheckAgn =0;
			if (typeof debtRe !== 'undefined') {
				for(var c=0; c<debtRe.records.length;c++) {
					var recordDebt = debtRe.records[c];
					if (recordDebt.year===$scope.selectedYear&&recordDebt.month===$scope.selectedMonthNo) {
						$scope.recordReq = recordDebt;
						counterCheckAgn++;
						
						$scope.noRecordsToDisplay = false;
						if ($scope.selectedYear===year&&$scope.selectedMonthNo===month) {
							$scope.presentMonthCheck = true;
							
						} else {
							$scope.presentMonthCheck = false;
						}
					}
				}
			} 
			if(counterCheckAgn===0){
				
				$scope.noRecordsToDisplay = true;
			}
		};
		


		var noOfMonths = function (date1, date2) {
		    var Nomonths;
		    Nomonths= (date2.getFullYear() - date1.getFullYear()) * 12;
		    Nomonths-= date1.getMonth() + 1;
		    Nomonths+= date2.getMonth();
		    return Nomonths <= 0 ? 0 : Nomonths;
		};
		
		var jan312009 = new Date(2015,9,4);
		var eightMonthsFromJan312009 = new Date(new Date(jan312009).setMonth(jan312009.getMonth()+3));
		
		
		

        $scope.updateRecordsForNewMonth = function () {        	
        	
        	var needToUpdate = false;
        	//contribution status
        	/*
        	for(var bno = 0; bno<$scope.user.debtsInfoArr.length; bno++){
        		
        		var debtRe = $scope.user.debtsInfoArr[bno];
				if(debtRe.status==='In Progress') {    					    				    			
	        		var counterCheck = 0;
	    			for(var c=0; c<debtRe.records.length;c++) {
	    				var recordDebt = debtRe.records[c];	    				
	    				if (recordDebt.year===year&&recordDebt.month===month) {
	    					
							counterCheck++;
	    				}
	    			}

	    			//IF COUNTERCHECK IS 0, NEED TO UPDATE
	    			if(counterCheck===0) {

	    				needToUpdate = true;
						var monthCounter = noOfMonths(new Date($scope.user.lastUpdateDebts),dt)+1;
						

						for (var m = 1; m<=monthCounter; m++) {	 
							displayLiabilitiesRecords = angular.copy(LiabilitiesService.liabilitiesRecords);   					
	    					var fromDate = new Date($scope.user.lastUpdateDebts);
							var currentDate = new Date(fromDate.setMonth(fromDate.getMonth()+m));
		    				var thisMonth = currentDate.getMonth();
		    				var thisYear = currentDate.getFullYear();		    				

		    				
		    				
		    				
		    				var record = {
		    					id: debtRe.records.length+1,
				        		month: thisMonth,
				        		year: thisYear,
				        		loanBalance: debtRe.loanBalance,
				        		monthly: 0,
				        		monthlyPayStatus: false,
				        		repaymentNo: debtRe.repaymentNo,
				        		liabilitiesRecordsCreated: true,
				        		IERecordsCreated: false
				        	};        				        	        	
				        	debtRe.records.push(record);

				        	if (($scope.user.liabilitiesRecordsPeriod.maxMonth <= thisMonth && $scope.user.liabilitiesRecordsPeriod.maxYear <= thisYear) || ($scope.user.liabilitiesRecordsPeriod.maxMonth > thisMonth && $scope.user.liabilitiesRecordsPeriod.maxYear < thisYear)) {

				        		$scope.user.liabilitiesRecordsPeriod.maxMonth = thisMonth;
				                $scope.user.liabilitiesRecordsPeriod.maxYear = thisYear;
				        	} 

			        	 	//Existing record but no record of that month
			                var existenceCheck = 0;
			                for (var j=0;j<$scope.user.liabilitiesRecords.length; j++) {   
			                    var recordChecker = $scope.user.liabilitiesRecords[j];                                                         
			                    if (recordChecker.month===thisMonth&&recordChecker.year===thisYear) {
			                        existenceCheck++;
			                        
			                    }
			                }
			                if (existenceCheck===0) {
			                    displayLiabilitiesRecords.year = thisYear;
			                    displayLiabilitiesRecords.month = thisMonth;                                
			                    $scope.user.liabilitiesRecords.push(displayLiabilitiesRecords);  
			                    
			                    
				            	
			                }
				        }
	    			}
	    		}
        	}
        	if (needToUpdate) {        		
        		$scope.user.lastUpdateDebts = dt.getFullYear()+'-'+(dt.getMonth()+1)+'-'+dt.getDate();
				var userNow = new Users($scope.user);
	            userNow.$update(function(response) {
	                $scope.success = true;
	                Authentication.user = response;
	                $scope.user = Authentication.user;
	            }, function(response) {
	                $scope.error = response.data.message;
	            });
	            
			}

			*/
        	for (var b = 0; b<$scope.user.debtsInfoArr.length; b++) {
        		var debtRe = $scope.user.debtsInfoArr[b];
        		debtRe.id = $scope.user.debtsInfoArr.indexOf(debtRe)+1;
        		if(debtRe.status==='In Progress') {    					    				
    			
	        		var counterCheck = 0;
	    			//debtRe.monthlyPayStatus = false;
	    			//array of yearmonth that needs updating since last update

	    			for(var c=0; c<debtRe.records.length;c++) {
	    				var recordDebt = debtRe.records[c];	    				
	    				if (recordDebt.year===year&&recordDebt.month===month) {
	    					
							counterCheck++;
	    				}
	    			}

	    			if(counterCheck===0) {
	    			
	    				//Were there any previous months where records were not created?

	    				needToUpdate = true;

						var monthCounter = noOfMonths(new Date($scope.user.lastUpdateDebts),dt)+1;
						

	    				//var jan312009 = new Date(2009, 1-1, 31);
	    				for (var m = 1; m<=monthCounter; m++) {
	    					displayLiabilitiesRecords = angular.copy(LiabilitiesService.liabilitiesRecords);   						    					
	    					var fromDate = new Date($scope.user.lastUpdateDebts);
							var currentDate = new Date(fromDate.setMonth(fromDate.getMonth()+m));
		    				var thisMonth = currentDate.getMonth();
		    				var thisYear = currentDate.getFullYear();		    				

		    				
		    				
		    				
		    				var record = {
		    					id: debtRe.records.length+1,
				        		month: thisMonth,
				        		year: thisYear,
				        		loanBalance: debtRe.loanBalance,
				        		monthly: 0,
				        		monthlyPayStatus: false,
				        		repaymentNo: debtRe.repaymentNo,
				        		liabilitiesRecordsCreated: true,
				        		IERecordsCreated: false
				        	};        
				        	        	
				        	debtRe.records.push(record);
				        	//Need to create missing records omg

		    				if (($scope.user.liabilitiesRecordsPeriod.maxMonth <= thisMonth && $scope.user.liabilitiesRecordsPeriod.maxYear <= thisYear) || ($scope.user.liabilitiesRecordsPeriod.maxMonth > thisMonth && $scope.user.liabilitiesRecordsPeriod.maxYear < thisYear)) {

				        		$scope.user.liabilitiesRecordsPeriod.maxMonth = thisMonth;
				                $scope.user.liabilitiesRecordsPeriod.maxYear = thisYear;
				        	} 

			        	 	//Existing record but no record of that month
			                var existenceCheck = 0;
			                for (var j=0;j<$scope.user.liabilitiesRecords.length; j++) {   
			                    var recordChecker = $scope.user.liabilitiesRecords[j];                                                         
			                    if (recordChecker.month===thisMonth&&recordChecker.year===thisYear) {
			                        existenceCheck++;
			                        
			                    }
			                }
			                if (existenceCheck===0) {
			                    displayLiabilitiesRecords.year = thisYear;
			                    displayLiabilitiesRecords.month = thisMonth;                                
			                    $scope.user.liabilitiesRecords.push(displayLiabilitiesRecords);  
			                    
			                    
				            	
			                }
				            

							for(var i=0;i<$scope.user.liabilitiesRecords.length; i++) {            
				                var liabilityRecord = $scope.user.liabilitiesRecords[i];  

				            	if (liabilityRecord.month===thisMonth&&liabilityRecord.year===thisYear) {

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
        	}
        	
        	if (needToUpdate) {        		
        		$scope.user.lastUpdateDebts = dt.getFullYear()+'-'+(dt.getMonth()+1)+'-'+dt.getDate();
				var userNow = new Users($scope.user);
	            userNow.$update(function(response) {
	                $scope.success = true;
	                Authentication.user = response;
	                $scope.user = Authentication.user;
	            }, function(response) {
	                $scope.error = response.data.message;
	            });
	            
			}
			
        };
        $scope.updateRecordsForNewMonth();

        $scope.contributionModal = function (debt) {
        	$scope.debtDetails = true;
        	$scope.contributionConfirm = false;
        	$scope.success = false;
        	$scope.debt = debt;
        	//format dates
        	$scope.displayStartDate = dateFormatter(new Date($scope.debt.startDate));
        	$scope.displayEndDate = dateFormatter(new Date($scope.debt.endDate));

        	var debtRe = $scope.debt;
			//
			
			
			for(var c=0; c<debtRe.records.length;c++) {
				var recordDebt = debtRe.records[c];
				if (recordDebt.year===$scope.selectedYear&&recordDebt.month===$scope.selectedMonthNo) {
					$scope.recordReq = recordDebt;
					
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
        	


			//var jan312009 = new Date(2009, 1-1, 31);

            //Update INCOME&EXPENSE
            if (!$scope.user.incomeExpenseRecordsPeriod) {
            	//If there is no existing record
                
                $scope.user.incomeExpenseRecordsPeriod = {};
                $scope.user.incomeExpenseRecordsPeriod.minMonth = $scope.item.month;
                $scope.user.incomeExpenseRecordsPeriod.minYear = $scope.item.year;
                $scope.user.incomeExpenseRecordsPeriod.maxMonth = $scope.item.month;
                $scope.user.incomeExpenseRecordsPeriod.maxYear = $scope.item.year;                

            } else if (($scope.user.incomeExpenseRecordsPeriod.maxMonth <= $scope.item.month && $scope.user.incomeExpenseRecordsPeriod.maxYear <= $scope.item.year) || ($scope.user.incomeExpenseRecordsPeriod.maxMonth > $scope.item.month && $scope.user.incomeExpenseRecordsPeriod.maxYear < $scope.item.year)) {

                
                //ASSUMING THAT THE USER NEVER INSERTS DATA FOR THE FUTURE (HE CANT POSSIBLY DO SO ALSO)
                //SETS RECORDS MAX PERIOD TO PRESENT MONTH & YEAR
                //I ALSO CURRENTLY DONT ALLOW USERS TO SET BUDGET FOR THE FUTURE (ONLY FOR PRESENT MONTH)
                $scope.user.incomeExpenseRecordsPeriod.maxMonth = $scope.item.month;
                $scope.user.incomeExpenseRecordsPeriod.maxYear = $scope.item.year;
            }

             
            
            if($scope.user.incomeExpenseRecords.length===0) { //in the event of an empty record (FIRSTTIME)                
                
                $scope.displayIncomeExpenseRecords.year = $scope.item.year;
                $scope.displayIncomeExpenseRecords.month = $scope.item.month;                                
                $scope.user.incomeExpenseRecords.push($scope.displayIncomeExpenseRecords); 
            } else { //Existing record but no record of that month
                var existenceCheck = 0;
                for (var k=0;k<$scope.user.incomeExpenseRecords.length; k++) {   
                    var recordChecker = $scope.user.incomeExpenseRecords[k];                                                         
                    if (recordChecker.month===$scope.item.month&&recordChecker.year===$scope.item.year) {
                        existenceCheck++;
                        
                    }
                }
                if (existenceCheck===0) {
                    $scope.displayIncomeExpenseRecords.year = $scope.item.year;
                    $scope.displayIncomeExpenseRecords.month = $scope.item.month;                                
                    $scope.user.incomeExpenseRecords.push($scope.displayIncomeExpenseRecords);  
                    
                }
            }

            for(var a=0;a<$scope.user.incomeExpenseRecords.length; a++) {            
                var expenseRecord = $scope.user.incomeExpenseRecords[a];  

                if (expenseRecord.month===$scope.item.month&&expenseRecord.year===$scope.item.year) {
                    
                    var thisMonthSpecExpense = {};
                    
                    if($scope.debt.type!=='Car Loan') {                        
                    	thisMonthSpecExpense = expenseRecord.monthlyExpense.fixedExpense;
                   
	                    for (var get10 in thisMonthSpecExpense) {                        
	                        var obj10 = thisMonthSpecExpense[get10];
	                        if($scope.debt.type === 'Mortgage Loan' && obj10.description==='Mortgage Repayments') {        	
	                            
	                            //need validation
	                            console.log(expenseRecord.month);
	                            console.log(expenseRecord.year);
	                            console.log('pre-value:' +obj10.value);
	                            obj10.value += $scope.debt.monthly;
	                            
	                            console.log('amt added:' +$scope.debt.monthly);
	                            console.log('post-value:' +obj10.value);
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

			//find months to that date and update
        	var dateItemStart = new Date($scope.item.year,$scope.item.month,1);
        	var monthCounter = noOfMonths(dateItemStart,new Date($scope.user.lastUpdateDebts))+1;
        	
        	
			
			

			//var currentDate1 = new Date(dateItemStart.setMonth(dateItemStart.getMonth()+1));
			//var currentDate2 = new Date(dateItemStart.setMonth(dateItemStart.getMonth()+2));

			//
			//

			//var fromDate = new Date($scope.user.lastUpdateDebts);
			

			for (var i = 0; i<$scope.user.debtsInfoArr.length; i++) {
        		var debtRe = $scope.user.debtsInfoArr[i];
        		
				if(debtRe.id===$scope.debt.id) {	
					
					for (var m = 0; m<=monthCounter; m++) {	
						
						dateItemStart = new Date($scope.item.year,$scope.item.month,1);
						var currentDate = new Date(dateItemStart.setMonth(dateItemStart.getMonth()+m));
						var thisMonth = currentDate.getMonth();
						var thisYear = currentDate.getFullYear();
						var recordDebt;
						
						
						
						if (m===0) {
							debtRe.loanBalance -= $scope.debt.monthly;
							
							if (debtRe.loanBalance < 0) {
								debtRe.loanBalance = 0;
							}
		        			debtRe.repaymentNo += 1;
		        			debtRe.monthly = $scope.debt.monthly;
		        		
		        			if(debtRe.loanBalance===0) {
		    					debtRe.status = 'Completed';
		    					debtRe.statusBoolean = true;		    					
						        if (((dt.getMonth()+1).toString()).length===1) {
						            monthPartString = '-0'+(dt.getMonth()+1);
						        } else {
						            monthPartString = '-'+(dt.getMonth()+1);
						        }
						        if ((dt.getDate().toString()).length===1) {
						            datePartString = '-0'+dt.getDate();
						        } else {
						            datePartString = '-'+dt.getDate();
						        }
		    					debtRe.actualEndDate = dt.getFullYear()+monthPartString+datePartString;
		    				}        		
		        			
		        			for(var c=0; c<debtRe.records.length;c++) {
		        				recordDebt = debtRe.records[c];
		        				if (recordDebt.year===thisYear&&recordDebt.month===thisMonth) {
			    					
			    					recordDebt.monthly = $scope.debt.monthly;
			    					recordDebt.expenseType = expenseChecker;
			    					recordDebt.loanBalance -= $scope.debt.monthly;
			    					if (recordDebt.loanBalance <0) {
			    						recordDebt.loanBalance =0;
			    					}
			    					recordDebt.monthlyPayStatus = true;
			    					recordDebt.repaymentNo = debtRe.repaymentNo;
			    					recordDebt.date = dt;
			    					recordDebt.IERecordsCreated = true;
			    				}
		        			}
		        		} else {

		        			for(var d=0; d<debtRe.records.length;d++) {
		        				recordDebt = debtRe.records[d];
		        				if (recordDebt.year===thisYear&&recordDebt.month===thisMonth) {
			    					
			    					//recordDebt.monthly = $scope.debt.monthly;
			    					//recordDebt.expenseType = expenseChecker;
			    					recordDebt.loanBalance -=$scope.debt.monthly;
			    					if (recordDebt.loanBalance<0) {
			    						recordDebt.loanBalance = 0;
			    					}
			    					//recordDebt.monthlyPayStatus = true;
			    					recordDebt.repaymentNo = debtRe.repaymentNo;
			    					//recordDebt.date = dt;
			    					recordDebt.IERecordsCreated = false;

			    					if(debtRe.loanBalance===0) {
				    					debtRe.status = 'Completed';
				    					debtRe.statusBoolean = true;		    					
								        if (((dt.getMonth()+1).toString()).length===1) {
								            monthPartString = '-0'+(dt.getMonth()+1);
								        } else {
								            monthPartString = '-'+(dt.getMonth()+1);
								        }
								        if ((dt.getDate().toString()).length===1) {
								            datePartString = '-0'+dt.getDate();
								        } else {
								            datePartString = '-'+dt.getDate();
								        }
				    					debtRe.actualEndDate = dt.getFullYear()+monthPartString+datePartString;
				    				}
			    				}
		        			}
		        		}


		        		for(var j=0;j<$scope.user.liabilitiesRecords.length; j++) {            
	                		var liabilityRecord = $scope.user.liabilitiesRecords[j];  
	                		
			            	if (liabilityRecord.month===thisMonth&&liabilityRecord.year===thisYear) {
			            		var loansMortgagesRec = liabilityRecord.loansMortgages;
			            		
			            		
			            		//update new loan balance
			            		for (var get in loansMortgagesRec) {                        
			                        var obj = loansMortgagesRec[get];
			                        if($scope.debt.type=== obj.description) {
			                        	
			                        	

			                        	obj.value -= $scope.debt.monthly;
			                        	obj.minValue -= $scope.debt.monthly;
			                        	
			                        	if (obj.value<0) {
			                        		obj.value = 0;
			                        	}
			                        	if (obj.minValue<0) {
			                        		obj.minValue = 0;
			                        	}
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

        	//$scope.debt.monthlyPayStatus = true;

			var userNow = new Users($scope.user);
            userNow.$update(function(response) {
                $scope.success = true;
                Authentication.user = response;
                $scope.user = Authentication.user;
            }, function(response) {
                $scope.error = response.data.message;
            });           
            
        };
        $scope.markAsComplete = function(debt) {
        	var completedObj = debt;
        	completedObj.completeTable = true;
			completedObj.id = $scope.user.debtsCompletedArr.length+1;			

			$scope.user.debtsCompletedArr.push(completedObj);

			for (var i = 0;  i<$scope.user.debtsInfoArr.length; i++) {
    			var debtSelected = $scope.user.debtsInfoArr[i];    			
    			if (debtSelected.id===debt.id) {    			   				
    				$scope.user.debtsInfoArr.splice(i,1);
    			}
			}

			$scope.success = $scope.error = null;			

			var user = new Users($scope.user);
			user.$update(function(response) {
				$scope.success = true;
				Authentication.user = response;
				$scope.user = Authentication.user;				

			}, function(response) {
				$scope.error = response.data.message;
			});			

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
	        	
	        	$scope.add1show = false;
	        	$scope.add2show = true;
        	}
        };

        $scope.setNewLoanBalance = function() {
        	$scope.loanBalance = $scope.newLoanBalance;
			
        	$scope.displayLoanBalance = $scope.loanBalance.toFixed(2);
	        $scope.newDebt.loanBalance = $scope.loanBalance;
        };


        $scope.getItem = function(item) {
        	$scope.item = item;
        	
        	
        };

        $scope.createLinkedDebt = function () {        
        	
        	
        	$scope.user.updatedManageDebt = true;
        	$scope.newDebt.status = 'In Progress';
        	$scope.newDebt.completeTable = false;
        	$scope.newDebt.statusBoolean = false;
        	//validate if the loan has already been completed
        	var startDate = new Date($scope.newDebt.startDate);
        	var endDate =  new Date(new Date(startDate).setMonth(startDate.getMonth()+$scope.newDebt.lenOfLoan));
        	if (endDate>dt) {

        		var monthPartString;
		        var datePartString;
		        if (((endDate.getMonth()+1).toString()).length===1) {
		            monthPartString = '-0'+(endDate.getMonth()+1);
		        } else {
		            monthPartString = '-'+(endDate.getMonth()+1);
		        }
		        if ((endDate.getDate().toString()).length===1) {
		            datePartString = '-0'+endDate.getDate();
		        } else {
		            datePartString = '-'+endDate.getDate();
		        }
		        $scope.newDebt.endDate = endDate.getFullYear()+monthPartString+datePartString;

	        	$scope.newDebt.id = $scope.user.debtsInfoArr.length + 1;
	        	$scope.newDebt.creationRecord = {
	        		month: month,
	        		year: year,
	        		loanBalance: $scope.newDebt.loanBalance,
	        		repaymentNo: $scope.newDebt.repaymentNo
	        	};
	        	$scope.newDebt.records = [];
	        	
	        	var record = {
	        		id: $scope.newDebt.records.length+1,
	        		month: month,
	        		year: year,	        		
	        		loanBalance: $scope.newDebt.loanBalance,
	        		monthly: 0,
	        		monthlyPayStatus: false,
	        		repaymentNo: $scope.newDebt.repaymentNo,
	        		liabilitiesRecordsCreated: true,
	        		IERecordsCreated: false
	        	};        
	        	        	
	        	$scope.newDebt.records.push(record);
	        	
	        	$scope.user.debtsInfoArr.push($scope.newDebt);

	        	
	        	
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
	                
	                displayLiabilitiesRecords.year = year;
	                displayLiabilitiesRecords.month = month;                                                
	                $scope.user.liabilitiesRecords.push(displayLiabilitiesRecords); 
	            } else { //Existing record but no record of that month
	                var existenceCheck = 0;
	                for (var j=0;j<$scope.user.liabilitiesRecords.length; j++) {   
	                    var recordChecker = $scope.user.liabilitiesRecords[j];                                                         
	                    if (recordChecker.month===month&&recordChecker.year===year) {
	                        existenceCheck++;
	                        
	                    }
	                }
	                if (existenceCheck===0) {
	                    displayLiabilitiesRecords.year = year;
	                    displayLiabilitiesRecords.month = month;                                
	                    $scope.user.liabilitiesRecords.push(displayLiabilitiesRecords);  
	                    
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
        		$scope.user.lastUpdateDebts = dt.getFullYear()+'-'+(dt.getMonth()+1)+'-'+dt.getDate();
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
            } else {
            	alert('Set an active loan. Loan must be completed after today.');
            }
        };


        $scope.resetModal = function() {
        	$scope.add1show = true;
	        $scope.add2show = false;
	        $scope.add3show = false;
	        $scope.newDebt = {};

	        if (((dt.getMonth()+1).toString()).length===1) {
	            $scope.newDebt.startDate = dt.getFullYear()+'-0'+(dt.getMonth()+1)+'-0'+dt.getDate();
	        } else {
	            $scope.newDebt.startDate = dt.getFullYear()+'-'+(dt.getMonth()+1)+'-0'+dt.getDate();
	        }
	        
        };

        $scope.previousModal1 = function() {
        	$scope.add1show = true;
        	$scope.add2show = false;
        };

        $scope.selectDeleteRecord = function(debt) {
        	$scope.debt = debt;
        };

		$scope.deleteRecord = function(type) {
			
			var deleteType = type; 
			
			
			if (!$scope.debt.actualEndDate) {
				$scope.debt.actualEndDate = new Date();
			}
			var dateItemStart = new Date($scope.debt.startDate);
        	var monthCounter = noOfMonths(dateItemStart,new Date($scope.debt.actualEndDate))+1;
        	
        	//
			
			//
		 	for (var m = 0; m<=monthCounter; m++) {	
				
				
				dateItemStart = new Date($scope.debt.startDate);
				var currentDate = new Date(dateItemStart.setMonth(dateItemStart.getMonth()+m));
				var thisMonth = currentDate.getMonth();
				var thisYear = currentDate.getFullYear();
				var recordDebt;
				
				
				
				
					/*
					debtRe.loanBalance -= $scope.debt.monthly;
        			debtRe.repaymentNo += 1;
        			debtRe.monthly = $scope.debt.monthly;
        		
        			if(debtRe.loanBalance===0) {
    					debtRe.status = 'Completed';
    					debtRe.statusBoolean = true;
    					debtRe.actualEndDate = dt.getFullYear()+'-'+dt.getMonth()+'-'+dt.getDate();
    				}        		
        			*/
    			for(var c=0; c<$scope.debt.records.length;c++) {
    				var currentDebtRecord = $scope.debt.records[c];
    				if (currentDebtRecord.year===thisYear&&currentDebtRecord.month===thisMonth) {
    					recordDebt = currentDebtRecord;
    					/*
    					
    					recordDebt.monthly = $scope.debt.monthly;
    					recordDebt.expenseType = expenseChecker;
    					recordDebt.loanBalance -= $scope.debt.monthly;
    					recordDebt.monthlyPayStatus = true;
    					recordDebt.repaymentNo = debtRe.repaymentNo;
    					recordDebt.date = dt;
    					recordDebt.IERecordsCreated = true;
    					*/
    				}
    			}
    		

        		for(var j=0;j<$scope.user.liabilitiesRecords.length; j++) {            
            		var liabilityRecord = $scope.user.liabilitiesRecords[j];  

	            	if (liabilityRecord.month===thisMonth&&liabilityRecord.year===thisYear) {
	            		var loansMortgagesRec = liabilityRecord.loansMortgages;
	            		
	            		//update new loan balance
	            		for (var get in loansMortgagesRec) {                        
	                        var obj = loansMortgagesRec[get];
	                        if($scope.debt.type=== obj.description) {
	                        	
	                        	console.log($scope.debt.type);
	                        	console.log('pre-value: ' +obj.value);
	                        	obj.value -= recordDebt.loanBalance;                        	                        		
	                        	obj.minValue -= recordDebt.loanBalance;
	                        	console.log('amt deducted: ' +recordDebt.loanBalance);
	                        	console.log('post-value: '+obj.value);
	                        	
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

        		for(var a=0;a<$scope.user.incomeExpenseRecords.length; a++) {            
	                var expenseRecord = $scope.user.incomeExpenseRecords[a];  

	                if (expenseRecord.month===thisMonth&&expenseRecord.year===thisYear) {
	                    
	                    var thisMonthSpecExpense = {};
	                    
	                    if($scope.debt.type!=='Car Loan') {                        
	                    	thisMonthSpecExpense = expenseRecord.monthlyExpense.fixedExpense;
	                   
		                    for (var get10 in thisMonthSpecExpense) {                        
		                        var obj10 = thisMonthSpecExpense[get10];
		                        if($scope.debt.type === 'Mortgage Loan' && obj10.description==='Mortgage Repayments') {        	
		                            
		                            //need validation
		                            obj10.value -= recordDebt.monthly;	
		                        } else if($scope.debt.type !== 'Mortgage Loan' && obj10.description==='Other Loan Repayments') {
		                        	obj10.value -= recordDebt.monthly;
	                    		}
	                    	}	

	                	} else {
	                        thisMonthSpecExpense = expenseRecord.monthlyExpense.transport;
	                        for (var get11 in thisMonthSpecExpense) {                        
		                        var obj11 = thisMonthSpecExpense[get11];
		                        if(obj11.description==='Car Loan Repayments') {        	
		                            
		                            //need validation
		                            obj11.value -= recordDebt.monthly;
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
		 	var index;
		 	var debtRe;
			if (deleteType === 'progressArray') {

			  	index = $scope.user.debtsInfoArr.indexOf($scope.debt);
			  	$scope.user.debtsInfoArr.splice(index, 1);

			  	for (var b = 0; b<$scope.user.debtsInfoArr.length; b++) {
	        		debtRe = $scope.user.debtsInfoArr[b];
	        		debtRe.id = $scope.user.debtsInfoArr.indexOf(debtRe)+1;
	        	}
        	} else {
        		
        		index = $scope.user.debtsCompletedArr.indexOf($scope.debt);
			  	$scope.user.debtsCompletedArr.splice(index, 1);

			  	for (var bc = 0; bc<$scope.user.debtsCompletedArr.length; bc++) {
	        		debtRe = $scope.user.debtsCompletedArr[bc];
	        		debtRe.id = $scope.user.debtsCompletedArr.indexOf(debtRe)+1;
	        	}
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

		$scope.setLoanBalance = function(item) {
			$scope.itemSelected = item;
			$scope.changeLoanBalance = $scope.itemSelected.loanBalance; 
		};

		$scope.updateLoanBalance = function() {
			var expenseChecker;
        	/*
            if (!$scope.user.incomeExpenseRecordsPeriod) {
            	//If there is no existing record
                
                $scope.user.incomeExpenseRecordsPeriod = {};
                $scope.user.incomeExpenseRecordsPeriod.minMonth = $scope.item.month;
                $scope.user.incomeExpenseRecordsPeriod.minYear = $scope.item.year;
                $scope.user.incomeExpenseRecordsPeriod.maxMonth = $scope.item.month;
                $scope.user.incomeExpenseRecordsPeriod.maxYear = $scope.item.year;                

            } else if (($scope.user.incomeExpenseRecordsPeriod.maxMonth <= $scope.item.month && $scope.user.incomeExpenseRecordsPeriod.maxYear <= $scope.item.year) || ($scope.user.incomeExpenseRecordsPeriod.maxMonth > $scope.item.month && $scope.user.incomeExpenseRecordsPeriod.maxYear < $scope.item.year)) {

                
                //ASSUMING THAT THE USER NEVER INSERTS DATA FOR THE FUTURE (HE CANT POSSIBLY DO SO ALSO)
                //SETS RECORDS MAX PERIOD TO PRESENT MONTH & YEAR
                //I ALSO CURRENTLY DONT ALLOW USERS TO SET BUDGET FOR THE FUTURE (ONLY FOR PRESENT MONTH)
                $scope.user.incomeExpenseRecordsPeriod.maxMonth = $scope.item.month;
                $scope.user.incomeExpenseRecordsPeriod.maxYear = $scope.item.year;
            }

             
            
            if($scope.user.incomeExpenseRecords.length===0) { //in the event of an empty record (FIRSTTIME)                
                
                $scope.displayIncomeExpenseRecords.year = $scope.item.year;
                $scope.displayIncomeExpenseRecords.month = $scope.item.month;                                
                $scope.user.incomeExpenseRecords.push($scope.displayIncomeExpenseRecords); 
            } else { //Existing record but no record of that month
                var existenceCheck = 0;
                for (var k=0;k<$scope.user.incomeExpenseRecords.length; k++) {   
                    var recordChecker = $scope.user.incomeExpenseRecords[k];                                                         
                    if (recordChecker.month===$scope.item.month&&recordChecker.year===$scope.item.year) {
                        existenceCheck++;
                        
                    }
                }
                if (existenceCheck===0) {
                    $scope.displayIncomeExpenseRecords.year = $scope.item.year;
                    $scope.displayIncomeExpenseRecords.month = $scope.item.month;                                
                    $scope.user.incomeExpenseRecords.push($scope.displayIncomeExpenseRecords);  
                    
                }
            }

            for(var a=0;a<$scope.user.incomeExpenseRecords.length; a++) {            
                var expenseRecord = $scope.user.incomeExpenseRecords[a];  

                if (expenseRecord.month===$scope.item.month&&expenseRecord.year===$scope.item.year) {
                    
                    var thisMonthSpecExpense = {};
                    
                    if($scope.debt.type!=='Car Loan') {                        
                    	thisMonthSpecExpense = expenseRecord.monthlyExpense.fixedExpense;
                   
	                    for (var get10 in thisMonthSpecExpense) {                        
	                        var obj10 = thisMonthSpecExpense[get10];
	                        if($scope.debt.type === 'Mortgage Loan' && obj10.description==='Mortgage Repayments') {        	
	                            
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
			*/
			//find months to that date and update
        	var dateItemStart = new Date($scope.itemSelected.year,$scope.itemSelected.month,1);
        	var monthCounter = noOfMonths(dateItemStart,new Date($scope.user.lastUpdateDebts))+1;
        	
        	
			
			


			//var currentDate1 = new Date(dateItemStart.setMonth(dateItemStart.getMonth()+1));
			//var currentDate2 = new Date(dateItemStart.setMonth(dateItemStart.getMonth()+2));

			//
			//

			//var fromDate = new Date($scope.user.lastUpdateDebts);
			

			for (var i = 0; i<$scope.user.debtsInfoArr.length; i++) {
        		var debtRe = $scope.user.debtsInfoArr[i];
        		
				if(debtRe.id===$scope.debt.id) {	
					
					for (var m = 0; m<=monthCounter; m++) {	
						
						dateItemStart = new Date($scope.itemSelected.year,$scope.itemSelected.month,1);
						var currentDate = new Date(dateItemStart.setMonth(dateItemStart.getMonth()+m));
						var thisMonth = currentDate.getMonth();
						var thisYear = currentDate.getFullYear();
						var recordDebt;
						var originalLoanBalance; 
						
						
						
						if (m===0) {
							//originalLoanBalance = debtRe.loanBalance;
							debtRe.loanBalance = $scope.changeLoanBalance;
							if (debtRe.loanBalance < 0) {
								debtRe.loanBalance = 0;
							}
		        			//debtRe.repaymentNo += 1;
		        			//debtRe.monthly = $scope.debt.monthly;
		        			debtRe.status ='In Progress';
		        			if(debtRe.loanBalance===0) {
		    					debtRe.status = 'Completed';
		    					debtRe.statusBoolean = true;		    					
						        if (((dt.getMonth()+1).toString()).length===1) {
						            monthPartString = '-0'+(dt.getMonth()+1);
						        } else {
						            monthPartString = '-'+(dt.getMonth()+1);
						        }
						        if ((dt.getDate().toString()).length===1) {
						            datePartString = '-0'+dt.getDate();
						        } else {
						            datePartString = '-'+dt.getDate();
						        }
		    					debtRe.actualEndDate = dt.getFullYear()+monthPartString+datePartString;
		    				}        		
		        			
		        			for(var c=0; c<debtRe.records.length;c++) {
		        				recordDebt = debtRe.records[c];
		        				if (recordDebt.year===thisYear&&recordDebt.month===thisMonth) {
			    					
			    					//recordDebt.monthly = $scope.debt.monthly;
			    					//recordDebt.expenseType = expenseChecker;
			    					originalLoanBalance = recordDebt.loanBalance; 
			    					recordDebt.loanBalance = $scope.changeLoanBalance;
			    					if (recordDebt.loanBalance <0) {
			    						recordDebt.loanBalance =0;
			    					}
			    					//recordDebt.monthlyPayStatus = true;
			    					//recordDebt.repaymentNo = debtRe.repaymentNo;
			    					//recordDebt.date = dt;
			    					//recordDebt.IERecordsCreated = true;
			    					debtRe.status = 'In Progress';
			    					if(debtRe.loanBalance===0) {
				    					debtRe.status = 'Completed';
				    					debtRe.statusBoolean = true;		    					
								        if (((dt.getMonth()+1).toString()).length===1) {
								            monthPartString = '-0'+(dt.getMonth()+1);
								        } else {
								            monthPartString = '-'+(dt.getMonth()+1);
								        }
								        if ((dt.getDate().toString()).length===1) {
								            datePartString = '-0'+dt.getDate();
								        } else {
								            datePartString = '-'+dt.getDate();
								        }
				    					debtRe.actualEndDate = dt.getFullYear()+monthPartString+datePartString;
				    				} 
			    				}
		        			}
		        		} else {

		        			for(var d=0; d<debtRe.records.length;d++) {
		        				recordDebt = debtRe.records[d];
		        				if (recordDebt.year===thisYear&&recordDebt.month===thisMonth) {
			    					
			    					//recordDebt.monthly = $scope.debt.monthly;
			    					//recordDebt.expenseType = expenseChecker;
			    					originalLoanBalance = recordDebt.loanBalance;			    				
		    						debtRe.loanBalance -= recordDebt.monthly;
		    						recordDebt.loanBalance = debtRe.loanBalance; 			    																	    					
			    					if (recordDebt.loanBalance<0) {
			    						recordDebt.loanBalance = 0;
			    					}
			    					//recordDebt.monthlyPayStatus = true;
			    					//recordDebt.repaymentNo = debtRe.repaymentNo;
			    					//recordDebt.date = dt;
			    					//recordDebt.IERecordsCreated = false;

			    					debtRe.status ='In Progress';
				        			if(debtRe.loanBalance===0) {
				    					debtRe.status = 'Completed';
				    					debtRe.statusBoolean = true;		    					
								        if (((dt.getMonth()+1).toString()).length===1) {
								            monthPartString = '-0'+(dt.getMonth()+1);
								        } else {
								            monthPartString = '-'+(dt.getMonth()+1);
								        }
								        if ((dt.getDate().toString()).length===1) {
								            datePartString = '-0'+dt.getDate();
								        } else {
								            datePartString = '-'+dt.getDate();
								        }
				    					debtRe.actualEndDate = dt.getFullYear()+monthPartString+datePartString;
				    				}
			    				}
		        			}
		        		}


		        		for(var j=0;j<$scope.user.liabilitiesRecords.length; j++) {            
	                		var liabilityRecord = $scope.user.liabilitiesRecords[j];  
	                		
			            	if (liabilityRecord.month===thisMonth&&liabilityRecord.year===thisYear) {
			            		var loansMortgagesRec = liabilityRecord.loansMortgages;
			            		
			            		
			            		//update new loan balance
			            		for (var get in loansMortgagesRec) {                        
			                        var obj = loansMortgagesRec[get];
			                        if($scope.debt.type=== obj.description) {
			                        	
			                        	

			                        	obj.value -= originalLoanBalance;
			                        	obj.minValue -= originalLoanBalance;
			                        	obj.value += debtRe.loanBalance;
			                        	obj.minValue += debtRe.loanBalance;
			                        	
			                        	if (obj.value<0) {
			                        		obj.value = 0;
			                        	}
			                        	if (obj.minValue<0) {
			                        		obj.minValue = 0;
			                        	}
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

        	//$scope.debt.monthlyPayStatus = true;

			var userNow = new Users($scope.user);
            userNow.$update(function(response) {
                $scope.success = true;
                Authentication.user = response;
                $scope.user = Authentication.user;
            }, function(response) {
                $scope.error = response.data.message;
            });           

		}; 

    }
]);
