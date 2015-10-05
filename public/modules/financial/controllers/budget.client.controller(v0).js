'use strict';

// Articles controller
angular.module('financial').controller('BudgetController', ['$scope', '$rootScope', '$stateParams', '$location', 'Authentication', 'Users', '$q', 'IncomeExpenseService', 'BudgetService',
    function($scope, $rootScope, $stateParams, $location, Authentication, Users, $q, IncomeExpenseService, BudgetService) {
        $scope.user = Authentication.user;

        // If user is not signed in then redirect back home
        if (!$scope.user) $location.path('/');
        
        this.$setScope = function(context) {
            $scope = context;
        };

        $scope.displayIncomeExpenseRecords = angular.copy(IncomeExpenseService.incomeExpenseRecords);
        var thisMonthExpense;
        
        $scope.fixedExpense = $scope.displayIncomeExpenseRecords.monthlyExpense.fixedExpense;
        $scope.transportExpense = $scope.displayIncomeExpenseRecords.monthlyExpense.transport;
        $scope.utilityExpense = $scope.displayIncomeExpenseRecords.monthlyExpense.utilityHousehold;
        $scope.foodExpense = $scope.displayIncomeExpenseRecords.monthlyExpense.foodNecessities;
        $scope.miscExpense = $scope.displayIncomeExpenseRecords.monthlyExpense.misc;
        
        //actual copy
        var incomeExpense = $scope.user.incomeExpenseRecords;       
        var today = new Date();
        //Retrieve records for present month
        var presentMonth = today.getMonth();
        var presentYear = today.getYear() +1900;

        //Date Limits initialized
        var dateObjStart = new Date(today.getFullYear(),today.getMonth(),1);
        if (((dateObjStart.getMonth()+1).toString()).length===1) {
            $scope.firstDay = dateObjStart.getFullYear()+'-0'+(dateObjStart.getMonth()+1)+'-0'+dateObjStart.getDate();
        } else {
            $scope.firstDay = dateObjStart.getFullYear()+'-'+(dateObjStart.getMonth()+1)+'-0'+dateObjStart.getDate();
        }
        var dateObjEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0); 
        if (((dateObjEnd.getMonth()+1).toString()).length===1) {
            $scope.lastDay = dateObjEnd.getFullYear()+'-0'+(dateObjEnd.getMonth()+1)+'-'+dateObjEnd.getDate();   
        } else {
            $scope.lastDay = dateObjEnd.getFullYear()+'-'+(dateObjEnd.getMonth()+1)+'-'+dateObjEnd.getDate();   
        }


        $scope.feStatus =true;        
        $scope.tStatus =true;
        $scope.fStatus =true;
        $scope.uStatus =true;
        $scope.mStatus =true;

        $scope.formSubmitted = false;
        
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
        var monthString = mth[presentMonth];            
        $scope.displayDate = monthString+', '+presentYear;        

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

        var standingCheck = function (actual, budget) {
            if (actual<= budget) {                
                return true;
                
            } else {                
                return false;
            }
        }; 
        

        $scope.loadTables = function() {


            $scope.incomeExpenseChartDisplay = true;
            $scope.incomeExpenseDoughnutData = [1]; 
            $scope.incomeExpenseDoughnutLabels = ['No Data'];            
            
            
            //INITIALIZING BUDGET LIMITS & PROGRESS BARS
            if (typeof $scope.user.budgetLimits === 'undefined') {     
                console.log('First time bitch');
                $scope.user.budgetLimits = angular.copy(BudgetService.budgetLimits);                
                var userNow = new Users($scope.user);
                userNow.$update(function(response) {
                    $scope.success = true;
                    Authentication.user = response;
                    $scope.user = Authentication.user;
                }, function(response) {
                    $scope.error = response.data.message;
                });
            }
            $scope.fixedExpenseB = $scope.user.budgetLimits.fixedExpenseB;
            $scope.transportB = $scope.user.budgetLimits.transportB;
            $scope.foodB = $scope.user.budgetLimits.foodB;
            $scope.miscB = $scope.user.budgetLimits.miscB;
            $scope.utilitiesB = $scope.user.budgetLimits.utilitiesB;

            $scope.feBudgetSet = false;
            $scope.tBudgetSet = false;
            $scope.fBudgetSet = false;
            $scope.mBudgetSet = false;
            $scope.uBudgetSet = false;
            $scope.allBudgetSet = false;

            if ($scope.user.budgetLimits.fixedExpenseB!==0) {
                $scope.feBudgetSet = true;
            }
            if ($scope.user.budgetLimits.transportB!==0) {
                $scope.tBudgetSet = true;   
            }
            if ($scope.user.budgetLimits.foodB!==0) {
                $scope.fBudgetSet = true;
            }
            if ($scope.user.budgetLimits.miscB!==0) {
                $scope.mBudgetSet = true;
            }
            if ($scope.user.budgetLimits.utilitiesB!==0) {
                $scope.uBudgetSet = true;
            }
            if($scope.feBudgetSet && $scope.tBudgetSet && $scope.fBudgetSet && $scope.mBudgetSet && $scope.uBudgetSet) {
                $scope.allBudgetSet = true;
            }

            $scope.userExpenseCopy = [];
            angular.copy($scope.user.incomeExpenseRecords, $scope.userExpenseCopy);            
            $scope.thisMonthFixedExpenseTotal = '0.00';
            $scope.thisMonthTransportTotal = '0.00';
            $scope.thisMonthMiscTotal = '0.00';
            $scope.thisMonthUtilitiesTotal = '0.00';
            $scope.thisMonthFoodTotal = '0.00';
            $scope.totalExpense = '0.00';


            $scope.displayFixedExpenseB = $scope.user.budgetLimits.fixedExpenseB;
            $scope.displayTransportB = $scope.user.budgetLimits.transportB;
            $scope.displayFoodB = $scope.user.budgetLimits.foodB;
            $scope.displayUtilitiesB = $scope.user.budgetLimits.utilitiesB;
            $scope.displayMiscB = $scope.user.budgetLimits.miscB;

            $scope.displayThisMonthFixedExpenseTotal = 0;
            $scope.displayThisMonthTransportTotal = 0;
            $scope.displayThisMonthFoodTotal = 0;
            $scope.displayThisMonthUtilitiesTotal = 0;
            $scope.displayThisMonthMiscTotal = 0;
            
            for(var i=0;i<$scope.userExpenseCopy.length; i++) {            
                var record = $scope.userExpenseCopy[i];
                
                if (record.month===presentMonth&&record.year===presentYear) {
                                                         
                    //Load Fixed Expense Table
                    var fixedExpenseArr = record.monthlyExpense.fixedExpense;
                    $scope.thisMonthFixedExpenseTotal = record.fixedExpenseAmt;
                    $scope.displayThisMonthFixedExpenseTotal = Number(record.fixedExpenseAmt);

                    var  valueE = ($scope.thisMonthFixedExpenseTotal/$scope.fixedExpenseB)*100;                    
                    var typeE = progressInfo(valueE);                   
                    $scope.dynamicE = Math.floor(valueE);
                    $scope.typeE = typeE;
                    $scope.feStatus = standingCheck($scope.thisMonthFixedExpenseTotal,$scope.fixedExpenseB);                    
                    $scope.displayFeExceed = ($scope.displayThisMonthFixedExpenseTotal-$scope.fixedExpenseB).toFixed(2);
                    
                    //Load Transport Expense Table
                    var transportArr = record.monthlyExpense.transport;                    
                    $scope.thisMonthTransportTotal = record.transportAmt;                    
                    $scope.displayThisMonthTransportTotal = Number(record.transportAmt);

                    var valueT = ($scope.thisMonthTransportTotal/$scope.transportB)*100;
                    var typeT = progressInfo(valueT);
                    $scope.dynamicT = Math.floor(valueT);                    
                    $scope.typeT =typeT;
                    $scope.tStatus = standingCheck($scope.thisMonthTransportTotal,$scope.transportB);
                    $scope.displayTExceed = ($scope.displayThisMonthTransportTotal-$scope.transportB).toFixed(2);
                    
                    //Load Food Expense Table
                    var foodArr = record.monthlyExpense.foodNecessities;
                    $scope.thisMonthFoodTotal = record.foodNecessitiesAmt;
                    $scope.displayThisMonthFoodTotal = Number(record.foodNecessitiesAmt);

                    var valueF = ($scope.thisMonthFoodTotal/$scope.foodB)*100;
                    var typeF = progressInfo(valueF);
                    $scope.dynamicF = Math.floor(valueF);
                    $scope.typeF =typeF;
                    $scope.fStatus = standingCheck($scope.thisMonthFoodTotal,$scope.foodB);
                    $scope.displayFExceed = ($scope.displayThisMonthFoodTotal-$scope.foodB).toFixed(2);

                    //Load Utilities Expense Table
                    var utilitiesArr = record.monthlyExpense.utilityHousehold;
                    $scope.thisMonthUtilitiesTotal = record.utilityHouseholdAmt;
                    $scope.displayThisMonthUtilitiesTotal = Number(record.utilityHouseholdAmt);

                    var valueU = ($scope.thisMonthUtilitiesTotal/$scope.utilitiesB)*100;
                    var typeU = progressInfo(valueU);
                    $scope.dynamicU = Math.floor(valueU);
                    $scope.typeU =typeU;
                    $scope.uStatus = standingCheck($scope.thisMonthUtilitiesTotal,$scope.utilitiesB);
                    $scope.displayUExceed = ($scope.displayThisMonthUtilitiesTotal-$scope.utilitiesB).toFixed(2);

                    //Load Misc Expense Table
                    var miscArr = record.monthlyExpense.misc;
                    $scope.thisMonthMiscTotal = record.miscAmt;
                    $scope.displayThisMonthMiscTotal = Number(record.miscAmt);

                    var valueM = ($scope.thisMonthMiscTotal/$scope.miscB)*100;
                    var typeM = progressInfo(valueM);
                    $scope.dynamicM = Math.floor(valueM);
                    $scope.typeM =typeM;
                    $scope.mStatus = standingCheck($scope.thisMonthMiscTotal,$scope.miscB);
                    $scope.displayMExceed = ($scope.displayThisMonthMiscTotal-$scope.miscB).toFixed(2);
                    //Load Charts

                    if(!record.fixedExpenseAmt && !record.transportAmt && !record.utilityHouseholdAmt && !record.foodNecessitiesAmt && !record.miscAmt) {
                        $scope.incomeExpenseDoughnutData = [1]; 
                        $scope.incomeExpenseDoughnutLabels = ['No Data'];
                                                
                        
                    } else {
                        $scope.incomeExpenseDoughnutData = [record.fixedExpenseAmt, record.transportAmt, record.utilityHouseholdAmt, record.foodNecessitiesAmt, record.miscAmt]; 
                        $scope.incomeExpenseDoughnutLabels = ['Fixed Expense', 'Transport', 'Utilities & Household Maintenance', 'Food & Necessities', 'Miscellaneous'];                        
                        $scope.totalExpense = record.monthlyExpenseAmt;                        
                    }

                    $scope.feDiffTable = [];
                    $scope.tDiffTable = [];
                    $scope.fDiffTable = [];
                    $scope.mDiffTable =[];
                    $scope.uDiffTable = [];

                    $scope.fixedExpenseTable = [];
                    $scope.transportTable = [];
                    $scope.foodTable = [];
                    $scope.miscTable = [];
                    $scope.utilitiesTable = []; 
                    

                    var rt;
                    var feType;
                    var feRecords;
                    var recordsTotal;
                    var diff;
                    var diffObj;
                    var indRecord;                    
                    var a;
                    var dateFormatted;
                    var amount;
                    var modRecord;
                    for (rt in fixedExpenseArr) {
                        feType = fixedExpenseArr[rt];
                        feRecords = feType.records;
                        recordsTotal = feType.recordsTotal;                       
                        
                        if (feType.value>feType.recordsTotal) {
                            diff = (feType.value-feType.recordsTotal).toFixed(2);                                
                            diffObj = {
                                type : feType.description,
                                diff : diff
                            };
                            $scope.feDiffTable.push(diffObj);
                        }                         

                        for(a=0; a<feRecords.length;a++) {
                            indRecord = feRecords[a];
                            dateFormatted = dateFormatter(new Date(feRecords[a].date));                        
                            amount = feRecords[a].amount.toFixed(2);

                            modRecord = {
                                detail: feRecords[a].detail,
                                date: dateFormatted,
                                amount: amount,
                                description:feType.description
                            };                            
                            $scope.fixedExpenseTable.push(modRecord);                        
                        }
                    }
                    for (rt in transportArr) {
                        feType = transportArr[rt];
                        feRecords = feType.records;
                        recordsTotal = feType.recordsTotal;                       
                        
                        if (feType.value>feType.recordsTotal) {
                            diff = (feType.value-feType.recordsTotal).toFixed(2);                                
                            diffObj = {
                                type : feType.description,
                                diff : diff
                            };
                            $scope.tDiffTable.push(diffObj);
                        }
                        

                        for(a=0; a<feRecords.length;a++) {
                            indRecord = feRecords[a];
                            dateFormatted = dateFormatter(new Date(feRecords[a].date));                        
                            amount = feRecords[a].amount.toFixed(2);

                            modRecord = {
                                detail: feRecords[a].detail,
                                date: dateFormatted,
                                amount: amount,
                                description:feType.description
                            };
                            $scope.transportTable.push(modRecord);
                        }
                    }

                    for (rt in foodArr) {
                        feType = foodArr[rt];
                        feRecords = feType.records;
                        recordsTotal = feType.recordsTotal;                       
                        
                        if (feType.value>feType.recordsTotal) {
                            diff = (feType.value-feType.recordsTotal).toFixed(2);                                
                            diffObj = {
                                type : feType.description,
                                diff : diff
                            };
                            $scope.fDiffTable.push(diffObj);
                        }
                        

                        for(a=0; a<feRecords.length;a++) {
                            indRecord = feRecords[a];
                            dateFormatted = dateFormatter(new Date(feRecords[a].date));                        
                            amount = feRecords[a].amount.toFixed(2);
                            //var modRecord = {feRecords[a].detail,}
                            //console.log(typeof feRecords[a].date); 

                            modRecord = {
                                detail: feRecords[a].detail,
                                date: dateFormatted,
                                amount: amount,
                                description:feType.description
                            };
                            $scope.foodTable.push(modRecord);
                        }
                    }

                    for (rt in utilitiesArr) {
                        feType = utilitiesArr[rt];
                        feRecords = feType.records;
                        recordsTotal = feType.recordsTotal;                       
                        
                        if (feType.value>feType.recordsTotal) {
                            diff = (feType.value-feType.recordsTotal).toFixed(2);                                
                            diffObj = {
                                type : feType.description,
                                diff : diff
                            };
                            $scope.uDiffTable.push(diffObj);
                        }
                        

                        for(a=0; a<feRecords.length;a++) {
                            indRecord = feRecords[a];
                            dateFormatted = dateFormatter(new Date(feRecords[a].date));                        
                            amount = feRecords[a].amount.toFixed(2);
                            //var modRecord = {feRecords[a].detail,}
                            //console.log(typeof feRecords[a].date); 

                            modRecord = {
                                detail: feRecords[a].detail,
                                date: dateFormatted,
                                amount: amount,
                                description:feType.description
                            };
                            $scope.utilitiesTable.push(modRecord);
                        }
                    }

                    for (rt in miscArr) {
                        feType = miscArr[rt];
                        feRecords = feType.records;
                        recordsTotal = feType.recordsTotal;                       
                        
                        if (feType.value>feType.recordsTotal) {
                            diff = (feType.value-feType.recordsTotal).toFixed(2);                                
                            diffObj = {
                                type : feType.description,
                                diff : diff
                            };
                            $scope.mDiffTable.push(diffObj);
                        }
                        

                        for(a=0; a<feRecords.length;a++) {
                            indRecord = feRecords[a];
                            dateFormatted = dateFormatter(new Date(feRecords[a].date));                        
                            amount = feRecords[a].amount.toFixed(2);
                            //var modRecord = {feRecords[a].detail,}
                            //console.log(typeof feRecords[a].date); 

                            modRecord = {
                                detail: feRecords[a].detail,
                                date: dateFormatted,
                                amount: amount,
                                description:feType.description
                            };
                            $scope.miscTable.push(modRecord);
                        }
                    }
                }
            }
                    
        };
        $scope.loadTables();

        $scope.addNewExpense = function() {


            $scope.type = $scope.type.trim();                

            if (!$scope.user.incomeExpenseRecordsPeriod) {
                //If there is no existing record
                console.log('do you enter?');
                $scope.user.incomeExpenseRecordsPeriod = {};
                $scope.user.incomeExpenseRecordsPeriod.minMonth = presentMonth;
                $scope.user.incomeExpenseRecordsPeriod.minYear = presentYear;
                $scope.user.incomeExpenseRecordsPeriod.maxMonth = presentMonth;
                $scope.user.incomeExpenseRecordsPeriod.maxYear = presentYear;                

            } else if (($scope.user.incomeExpenseRecordsPeriod.maxMonth <= presentMonth && $scope.user.incomeExpenseRecordsPeriod.maxYear <= presentYear) || ($scope.user.incomeExpenseRecordsPeriod.maxMonth > presentMonth && $scope.user.incomeExpenseRecordsPeriod.maxYear < presentYear)) {

                console.log('do you enter2?');
                //ASSUMING THAT THE USER NEVER INSERTS DATA FOR THE FUTURE (HE CANT POSSIBLY DO SO ALSO)
                //SETS RECORDS MAX PERIOD TO PRESENT MONTH & YEAR
                //I ALSO CURRENTLY DONT ALLOW USERS TO SET BUDGET FOR THE FUTURE (ONLY FOR PRESENT MONTH)
                $scope.user.incomeExpenseRecordsPeriod.maxMonth = presentMonth;
                $scope.user.incomeExpenseRecordsPeriod.maxYear = presentYear;
            }

             
            
            if($scope.user.incomeExpenseRecords.length===0) { //in the event of an empty record (FIRSTTIME)                
                console.log('1st');
                $scope.displayIncomeExpenseRecords.year = presentYear;
                $scope.displayIncomeExpenseRecords.month = presentMonth;                                
                $scope.user.incomeExpenseRecords.push($scope.displayIncomeExpenseRecords); 
            } else { //Existing record but no record of that month
                var existenceCheck = 0;
                for (var j=0;j<$scope.user.incomeExpenseRecords.length; j++) {   
                    var recordChecker = $scope.user.incomeExpenseRecords[j];                                                         
                    if (recordChecker.month===presentMonth&&recordChecker.year===presentYear) {
                        existenceCheck++;
                        console.log('2nd');
                    }
                }
                if (existenceCheck===0) {
                    $scope.displayIncomeExpenseRecords.year = presentYear;
                    $scope.displayIncomeExpenseRecords.month = presentMonth;                                
                    $scope.user.incomeExpenseRecords.push($scope.displayIncomeExpenseRecords);  
                    console.log('3rd');
                }
            }
            
            for(var i=0;i<$scope.user.incomeExpenseRecords.length; i++) {            
                var expenseRecord = $scope.user.incomeExpenseRecords[i];  

                if (expenseRecord.month===presentMonth&&expenseRecord.year===presentYear) {
                    
                    var thisMonthSpecExpense = {};
                    
                    if($scope.formRef==='fixedExpense') {                        
                        thisMonthSpecExpense = expenseRecord.monthlyExpense.fixedExpense;
                    } else if ($scope.formRef==='transport') {
                        thisMonthSpecExpense = expenseRecord.monthlyExpense.transport;
                    } else if ($scope.formRef==='utility') {
                        thisMonthSpecExpense = expenseRecord.monthlyExpense.utilityHousehold ;
                    } else if ($scope.formRef==='food') {
                        thisMonthSpecExpense = expenseRecord.monthlyExpense.foodNecessities;
                    } else if ($scope.formRef==='misc') {
                        thisMonthSpecExpense = expenseRecord.monthlyExpense.misc;
                    }

                    var record = {
                        detail: $scope.detail,
                        date: $scope.date,
                        amount: $scope.expenseAmt
                    };

                    console.log('Almost THERE');
                    
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
                    //thisMonthSpecExpense                                                                      
                                           
                }
                var fixedExpenseArr = expenseRecord.monthlyExpense.fixedExpense;
                var fixedExpenseTotal = 0;
                for (var rt in fixedExpenseArr) {
                    var obj1 = fixedExpenseArr[rt];
                    fixedExpenseTotal += obj1.value;
                }
                expenseRecord.fixedExpenseAmt = fixedExpenseTotal.toFixed(2);

                var transportArr = expenseRecord.monthlyExpense.transport;
                var transportTotal = 0;
                for (var rt1 in transportArr) {
                    var obj2 = transportArr[rt1];
                    transportTotal += obj2.value;
                }
                expenseRecord.transportAmt = transportTotal.toFixed(2);

                var utilityHouseholdArr = expenseRecord.monthlyExpense.utilityHousehold;
                var utilityHouseholdTotal = 0;
                for (var rt2 in utilityHouseholdArr) {
                    var obj3 = utilityHouseholdArr[rt2];
                    utilityHouseholdTotal += obj3.value;
                }
                expenseRecord.utilityHouseholdAmt = utilityHouseholdTotal.toFixed(2);

                var foodNecessitiesArr = expenseRecord.monthlyExpense.foodNecessities;
                var foodNecessitiesTotal = 0;
                for (var rt3 in foodNecessitiesArr) {
                    var obj4 = foodNecessitiesArr[rt3];
                    foodNecessitiesTotal += obj4.value;
                }
                expenseRecord.foodNecessitiesAmt = foodNecessitiesTotal.toFixed(2);

                var miscArr = expenseRecord.monthlyExpense.misc;
                var miscTotal = 0;
                for (var rt4 in miscArr) {
                    var obj5 = miscArr[rt4];
                    miscTotal += obj5.value;
                }
                expenseRecord.miscAmt = miscTotal.toFixed(2);

                var monthlyIncomeAmt = Number(expenseRecord.monthlyIncomeAmt);                
                var monthlyExpenseAmt = fixedExpenseTotal + transportTotal + utilityHouseholdTotal + foodNecessitiesTotal + miscTotal;
                var netCashFlow = monthlyIncomeAmt - monthlyExpenseAmt;                
                expenseRecord.monthlyIncomeAmt = monthlyIncomeAmt.toFixed(2);                
                expenseRecord.monthlyExpenseAmt = monthlyExpenseAmt.toFixed(2);
                expenseRecord.netCashFlow = netCashFlow.toFixed(2);  
            }

            var userNow = new Users($scope.user);
            userNow.$update(function(response) {
                $scope.success = true;
                Authentication.user = response;
                $scope.user = Authentication.user;
            }, function(response) {
                $scope.error = response.data.message;
            });
            //alert('Expense Added!');
            $scope.formSubmitted = true;
            $scope.detail = '';
            $scope.date = '';
            $scope.expenseAmt = '';
            $scope.type = '';
            $scope.loadTables();            
            //location.reload(); 
                           
        };

        $scope.resetModal = function () {            
            $scope.formSubmitted = false;
        };

        $scope.forms = {};        
        $scope.$watch('forms.addFixedExpenseForm.$valid', function() {
            console.log('watching feForm' + $scope.forms.addFixedExpenseForm.$valid); 
         });

        $scope.setFixedExpenseBudget = function() {

            $scope.user.budgetLimits.fixedExpenseB = $scope.fixedExpenseB;

            var userNow = new Users($scope.user);
            userNow.$update(function(response) {
                $scope.success = true;
                Authentication.user = response;
                $scope.user = Authentication.user;
            }, function(response) {
                $scope.error = response.data.message;
            });
            alert('Budget Set!');
            $scope.loadTables();
         };
        $scope.setTransportBudget = function() {
            
            $scope.user.budgetLimits.transportB = $scope.transportB;

            var userNow = new Users($scope.user);
            userNow.$update(function(response) {
                $scope.success = true;
                Authentication.user = response;
                $scope.user = Authentication.user;
            }, function(response) {
                $scope.error = response.data.message;
            });
            alert('Budget Set!');
            $scope.loadTables();
         };
        $scope.setUtilitiestBudget = function() {
            
            $scope.user.budgetLimits.utilitiesB = $scope.utilitiesB;

            var userNow = new Users($scope.user);
            userNow.$update(function(response) {
                $scope.success = true;
                Authentication.user = response;
                $scope.user = Authentication.user;
            }, function(response) {
                $scope.error = response.data.message;
            });
            alert('Budget Set!');
            $scope.loadTables();
         };
        $scope.setFoodBudget = function() {

            $scope.user.budgetLimits.foodB = $scope.foodB;

            var userNow = new Users($scope.user);
            userNow.$update(function(response) {
                $scope.success = true;
                Authentication.user = response;
                $scope.user = Authentication.user;
            }, function(response) {
                $scope.error = response.data.message;
            });
            alert('Budget Set!');
            $scope.loadTables();
         };
         $scope.setMiscBudget = function() {

            $scope.user.budgetLimits.miscB = $scope.miscB;

            var userNow = new Users($scope.user);
            userNow.$update(function(response) {
                $scope.success = true;
                Authentication.user = response;
                $scope.user = Authentication.user;
            }, function(response) {
                $scope.error = response.data.message;
            });
            alert('Budget Set!');
            $scope.loadTables();
         };

        $scope.standbyForDelete = function (item,expenseType) {
            $scope.item = item;
            $scope.expenseType = expenseType; 

        };

        $scope.cancelDelete = function () {
            $scope.item = '';
            $scope.expenseType = '';             
        };

        $scope.deleteRecord = function() {
                         
            for(var i=0;i<$scope.user.incomeExpenseRecords.length; i++) {            
                var expenseRecord = $scope.user.incomeExpenseRecords[i];  
                if (expenseRecord.month===presentMonth&&expenseRecord.year===presentYear) {
                    console.log('level1');
                    var expenseSelected;
                    
                    if($scope.expenseType==='fixedExpense') {
                        expenseSelected = expenseRecord.monthlyExpense.fixedExpense;
                        console.log('level2.1');                                                
                    } else if($scope.expenseType==='transport') {
                        expenseSelected = expenseRecord.monthlyExpense.transport;
                        console.log('level2.2');
                    } else if($scope.expenseType==='utility') {
                        expenseSelected = expenseRecord.monthlyExpense.utilityHousehold;
                        console.log('level2.3');
                    } else if($scope.expenseType==='food') {
                        expenseSelected = expenseRecord.monthlyExpense.foodNecessities;
                        console.log('level2.4');
                    } else if($scope.expenseType==='misc') {
                        expenseSelected = expenseRecord.monthlyExpense.misc;
                        console.log('level2.5');
                    }

                    for (var get in expenseSelected) {                        
                        var obj = expenseSelected[get];                        
                        
                        if($scope.item.description=== obj.description) {
                            console.log('SUCCESS');
                            for (var a =0; a<obj.records.length; a++) {
                                var specRec = obj.records[a];
                                var itemNo = Number($scope.item.amount);
                                if (specRec.detail===$scope.item.detail&&specRec.amount===itemNo){
                                    obj.recordsTotal -= itemNo;
                                    obj.value -= itemNo;
                                    obj.records.splice(a,1);
                                    console.log('Make it?');
                                    //MORE DETAILED CHECK REQUIRED
                                    //CHANGE RECORDS TOTAL                                        
                                }
                            }
                        }
                    }
                    var fixedExpenseArr = expenseRecord.monthlyExpense.fixedExpense;
                    var fixedExpenseTotal = 0;
                    for (var rt in fixedExpenseArr) {
                        var obj1 = fixedExpenseArr[rt];
                        fixedExpenseTotal += obj1.value;
                    }
                    expenseRecord.fixedExpenseAmt = fixedExpenseTotal.toFixed(2);

                    var transportArr = expenseRecord.monthlyExpense.transport;
                    var transportTotal = 0;
                    for (var rt1 in transportArr) {
                        var obj2 = transportArr[rt1];
                        transportTotal += obj2.value;
                    }
                    expenseRecord.transportAmt = transportTotal.toFixed(2);

                    var utilityHouseholdArr = expenseRecord.monthlyExpense.utilityHousehold;
                    var utilityHouseholdTotal = 0;
                    for (var rt2 in utilityHouseholdArr) {
                        var obj3 = utilityHouseholdArr[rt2];
                        utilityHouseholdTotal += obj3.value;
                    }
                    expenseRecord.utilityHouseholdAmt = utilityHouseholdTotal.toFixed(2);

                    var foodNecessitiesArr = expenseRecord.monthlyExpense.foodNecessities;
                    var foodNecessitiesTotal = 0;
                    for (var rt3 in foodNecessitiesArr) {
                        var obj4 = foodNecessitiesArr[rt3];
                        foodNecessitiesTotal += obj4.value;
                    }
                    expenseRecord.foodNecessitiesAmt = foodNecessitiesTotal.toFixed(2);

                    var miscArr = expenseRecord.monthlyExpense.misc;
                    var miscTotal = 0;
                    for (var rt4 in miscArr) {
                        var obj5 = miscArr[rt4];
                        miscTotal += obj5.value;
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
            var userNow = new Users($scope.user);
            userNow.$update(function(response) {
            $scope.success = true;
            Authentication.user = response;
            $scope.user = Authentication.user;

            }, function(response) {
                $scope.error = response.data.message;

            });
            $scope.item = '';
            $scope.expenseType = '';
            $scope.loadTables();            
        };

        $scope.setFixedExpense = function() {
            $scope.selectedExpense = $scope.fixedExpense;
            $scope.formRef = 'fixedExpense';
        };
        $scope.setTransportExpense = function() {
            $scope.selectedExpense = $scope.transportExpense;
            $scope.formRef = 'transport';
        };
        $scope.setUtilityExpense = function() {
            $scope.selectedExpense = $scope.utilityExpense;
            $scope.formRef = 'utility';
        };
        $scope.setFoodExpense = function() {
            $scope.selectedExpense = $scope.foodExpense;
            $scope.formRef = 'food';
        };
        $scope.setMiscExpense = function() {
            $scope.selectedExpense = $scope.miscExpense;            
            $scope.formRef = 'misc';
        };
     }

]);