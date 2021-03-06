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
        $scope.optionalExpense = $scope.displayIncomeExpenseRecords.monthlyExpense.optionalSavings;
        
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
        $scope.oStatus = true;

        $scope.formSubmitted = false;
        
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
        var monthString = $scope.mth[presentMonth];
        $scope.month = today.getMonth();
        $scope.year = today.getFullYear();
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

        $scope.$watch('selectedMonth', function() {            
            presentMonth = $scope.mth.indexOf($scope.selectedMonth);
            $scope.loadTables();            
        });
        $scope.$watch('selectedYear',function() {
            presentYear = $scope.selectedYear;
            $scope.loadTables();
        });
        

        $scope.loadTables = function() {            

            $scope.incomeExpenseChartDisplay = true;
            $scope.incomeExpenseDoughnutData = [1]; 
            $scope.incomeExpenseDoughnutLabels = ['No Data'];            

            $scope.fixedExpenseB = 0;
            $scope.transportB = 0;
            $scope.foodB = 0;
            $scope.miscB = 0;
            $scope.utilitiesB = 0;
            $scope.optionalB = 0;

            $scope.feBudgetSet = false;
            $scope.tBudgetSet = false;
            $scope.fBudgetSet = false;
            $scope.mBudgetSet = false;
            $scope.uBudgetSet = false;
            $scope.oBudgetSet = false;
            $scope.allBudgetSet = false;


            var exist =0;
            for (var ab=0; ab<$scope.user.budgetLimits.length; ab++) {

                var budgetLimit = $scope.user.budgetLimits[ab];
                if (budgetLimit.year===presentYear && budgetLimit.month ===presentMonth) {
                    
                    exist++;                    

                    $scope.fixedExpenseB = budgetLimit.fixedExpenseB;
                    $scope.transportB = budgetLimit.transportB;
                    $scope.foodB = budgetLimit.foodB;
                    $scope.miscB = budgetLimit.miscB;
                    $scope.utilitiesB = budgetLimit.utilitiesB;
                    $scope.optionalB = budgetLimit.optionalB;

                    if (budgetLimit.fixedExpenseB!==0) {
                        $scope.feBudgetSet = true;
                    }
                    if (budgetLimit.transportB!==0) {
                        $scope.tBudgetSet = true;   
                    }
                    if (budgetLimit.foodB!==0) {
                        $scope.fBudgetSet = true;
                    }
                    if (budgetLimit.miscB!==0) {
                        $scope.mBudgetSet = true;
                    }
                    if (budgetLimit.utilitiesB!==0) {
                        $scope.uBudgetSet = true;
                    }
                    if (budgetLimit.optionalB!==0) {
                        $scope.oBudgetSet = true;
                    }
                    if($scope.feBudgetSet && $scope.tBudgetSet && $scope.fBudgetSet && $scope.mBudgetSet && $scope.uBudgetSet && $scope.oBudgetSet) {
                        $scope.allBudgetSet = true;
                    }

                    $scope.displayFixedExpenseB = budgetLimit.fixedExpenseB;
                    $scope.displayTransportB = budgetLimit.transportB;
                    $scope.displayFoodB = budgetLimit.foodB;
                    $scope.displayUtilitiesB = budgetLimit.utilitiesB;
                    $scope.displayMiscB = budgetLimit.miscB;
                    $scope.displayOptionalB = budgetLimit.optionalB;
                }
            }

            $scope.userExpenseCopy = [];
            angular.copy($scope.user.incomeExpenseRecords, $scope.userExpenseCopy);            
            $scope.thisMonthFixedExpenseTotal = '0.00';
            $scope.thisMonthTransportTotal = '0.00';
            $scope.thisMonthMiscTotal = '0.00';
            $scope.thisMonthUtilitiesTotal = '0.00';
            $scope.thisMonthFoodTotal = '0.00';
            $scope.thisMonthOptionalTotal = '0.00';            
            $scope.totalExpense = '0.00';            

            $scope.displayThisMonthFixedExpenseTotal = 0;
            $scope.displayThisMonthTransportTotal = 0;
            $scope.displayThisMonthFoodTotal = 0;
            $scope.displayThisMonthUtilitiesTotal = 0;
            $scope.displayThisMonthMiscTotal = 0;
            $scope.displayThisMonthOptionalTotal = 0;

            $scope.feDiffTable = [];
            $scope.tDiffTable = [];
            $scope.fDiffTable = [];
            $scope.mDiffTable =[];
            $scope.uDiffTable = [];
            $scope.oDiffTable = [];

            $scope.fixedExpenseTable = [];
            $scope.transportTable = [];
            $scope.foodTable = [];
            $scope.miscTable = [];
            $scope.utilitiesTable = [];
            $scope.optionalTable = [];
            
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

                    //Load OptionalTable Expense Table
                    var optionalArr = record.monthlyExpense.optionalSavings;
                    $scope.thisMonthOptionalTotal = record.optionalSavingsAmt;
                    $scope.displayThisMonthOptionalTotal = Number(record.optionalSavingsAmt);

                    var valueO = ($scope.thisMonthOptionalTotal/$scope.optionalB)*100;
                    var typeO = progressInfo(valueO);
                    $scope.dynamicO = Math.floor(valueO);
                    $scope.typeO =typeO;
                    $scope.oStatus = standingCheck($scope.thisMonthOptionalTotal,$scope.optionalB);
                    $scope.displayOExceed = ($scope.displayThisMonthOptionalTotal-$scope.optionalB).toFixed(2);
                    //Load Charts

                    if(!record.fixedExpenseAmt && !record.transportAmt && !record.utilityHouseholdAmt && !record.foodNecessitiesAmt && !record.miscAmt && !record.optionalSavingsAmt) {
                        $scope.incomeExpenseDoughnutData = [1]; 
                        $scope.incomeExpenseDoughnutLabels = ['No Data'];
                                                
                        
                    } else {
                        $scope.incomeExpenseDoughnutData = [record.fixedExpenseAmt, record.transportAmt, record.utilityHouseholdAmt, record.foodNecessitiesAmt, record.miscAmt, record.optionalSavingsAmt];
                        $scope.incomeExpenseDoughnutLabels = ['Fixed Expense', 'Transport', 'Utilities & Household Maintenance', 'Food & Necessities', 'Miscellaneous', 'Optional Savings'];                        
                        $scope.totalExpense = record.monthlyExpenseAmt;                        
                    }

 
                    

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

                    for (rt in optionalArr) {
                        feType = optionalArr[rt];
                        feRecords = feType.records;
                        recordsTotal = feType.recordsTotal;                       
                        
                        if (feType.value>feType.recordsTotal) {
                            diff = (feType.value-feType.recordsTotal).toFixed(2);                                
                            diffObj = {
                                type : feType.description,
                                diff : diff
                            };
                            $scope.oDiffTable.push(diffObj);
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
                            $scope.optionalTable.push(modRecord);
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
                $scope.user.incomeExpenseRecordsPeriod = {};
                $scope.user.incomeExpenseRecordsPeriod.minMonth = presentMonth;
                $scope.user.incomeExpenseRecordsPeriod.minYear = presentYear;
                $scope.user.incomeExpenseRecordsPeriod.maxMonth = presentMonth;
                $scope.user.incomeExpenseRecordsPeriod.maxYear = presentYear;                

            } else if (($scope.user.incomeExpenseRecordsPeriod.maxMonth <= presentMonth && $scope.user.incomeExpenseRecordsPeriod.maxYear <= presentYear) || ($scope.user.incomeExpenseRecordsPeriod.maxMonth > presentMonth && $scope.user.incomeExpenseRecordsPeriod.maxYear < presentYear)) {

                //ASSUMING THAT THE USER NEVER INSERTS DATA FOR THE FUTURE (HE CANT POSSIBLY DO SO ALSO)
                //SETS RECORDS MAX PERIOD TO PRESENT MONTH & YEAR
                //I ALSO CURRENTLY DONT ALLOW USERS TO SET BUDGET FOR THE FUTURE (ONLY FOR PRESENT MONTH)
                $scope.user.incomeExpenseRecordsPeriod.maxMonth = presentMonth;
                $scope.user.incomeExpenseRecordsPeriod.maxYear = presentYear;
            }

             
            
            if($scope.user.incomeExpenseRecords.length===0) { //in the event of an empty record (FIRSTTIME)                
                $scope.displayIncomeExpenseRecords.year = presentYear;
                $scope.displayIncomeExpenseRecords.month = presentMonth;                                
                $scope.user.incomeExpenseRecords.push($scope.displayIncomeExpenseRecords); 
            } else { //Existing record but no record of that month
                var existenceCheck = 0;
                for (var j=0;j<$scope.user.incomeExpenseRecords.length; j++) {   
                    var recordChecker = $scope.user.incomeExpenseRecords[j];                                                         
                    if (recordChecker.month===presentMonth&&recordChecker.year===presentYear) {
                        existenceCheck++;
                    }
                }
                if (existenceCheck===0) {
                    $scope.displayIncomeExpenseRecords.year = presentYear;
                    $scope.displayIncomeExpenseRecords.month = presentMonth;                                
                    $scope.user.incomeExpenseRecords.push($scope.displayIncomeExpenseRecords);  
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
                    } else if ($scope.formRef==='optionalSavings') {
                        thisMonthSpecExpense = expenseRecord.monthlyExpense.optionalSavings;
                    }

                    var record = {
                        detail: $scope.detail,
                        date: $scope.date,
                        amount: $scope.expenseAmt
                    };
                    
                    for (var get in thisMonthSpecExpense) {                        
                        var obj = thisMonthSpecExpense[get];
                        //console.log($scope.type);
                        //console.log(obj.description);
                        if($scope.type=== obj.description) {                        
                            obj.recordsTotal += $scope.expenseAmt;
                            obj.records.push(record);
                            obj.value = Number(obj.value);
                            if (obj.recordsTotal>=obj.value) {
                                obj.value = obj.recordsTotal.toFixed(2);
                            }
                        }
                    }
                    //thisMonthSpecExpense                                                                      
                                           
                }
                var fixedExpenseArr = expenseRecord.monthlyExpense.fixedExpense;
                var fixedExpenseTotal = 0;
                for (var rt in fixedExpenseArr) {
                    var obj1 = fixedExpenseArr[rt];
                    fixedExpenseTotal += Number(obj1.value);
                }
                expenseRecord.fixedExpenseAmt = fixedExpenseTotal.toFixed(2);

                var transportArr = expenseRecord.monthlyExpense.transport;
                var transportTotal = 0;
                for (var rt1 in transportArr) {
                    var obj2 = transportArr[rt1];
                    transportTotal += Number(obj2.value);
                }
                expenseRecord.transportAmt = transportTotal.toFixed(2);

                var utilityHouseholdArr = expenseRecord.monthlyExpense.utilityHousehold;
                var utilityHouseholdTotal = 0;
                for (var rt2 in utilityHouseholdArr) {
                    var obj3 = utilityHouseholdArr[rt2];
                    utilityHouseholdTotal += Number(obj3.value);
                }
                expenseRecord.utilityHouseholdAmt = utilityHouseholdTotal.toFixed(2);

                var foodNecessitiesArr = expenseRecord.monthlyExpense.foodNecessities;
                var foodNecessitiesTotal = 0;
                for (var rt3 in foodNecessitiesArr) {
                    var obj4 = foodNecessitiesArr[rt3];
                    foodNecessitiesTotal += Number(obj4.value);
                }
                expenseRecord.foodNecessitiesAmt = foodNecessitiesTotal.toFixed(2);

                var miscArr = expenseRecord.monthlyExpense.misc;
                var miscTotal = 0;
                for (var rt4 in miscArr) {
                    var obj5 = miscArr[rt4];
                    miscTotal += Number(obj5.value);
                }
                expenseRecord.miscAmt = miscTotal.toFixed(2);

                var optionalArr = expenseRecord.monthlyExpense.optionalSavings;
                var optionalTotal = 0;
                for (var rt5 in optionalArr) {
                    var obj6 = optionalArr[rt5];
                    optionalTotal += Number(obj6.value);
                }
                expenseRecord.optionalSavingsAmt = optionalTotal.toFixed(2);



                var monthlyIncomeAmt = Number(expenseRecord.monthlyIncomeAmt);                
                var monthlyExpenseAmt = fixedExpenseTotal + transportTotal + utilityHouseholdTotal + foodNecessitiesTotal + miscTotal + optionalTotal;
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

        $scope.setBudget = function() {

            
            var checker = 0;
            for (var ab=0; ab<$scope.user.budgetLimits.length; ab++) {
                var budgetLimit = $scope.user.budgetLimits[ab];
                if (budgetLimit.year===presentYear && budgetLimit.month ===presentMonth) {
                    budgetLimit.fixedExpenseB = $scope.fixedExpenseB;
                    budgetLimit.transportB = $scope.transportB;
                    budgetLimit.utilitiesB = $scope.utilitiesB;
                    budgetLimit.foodB = $scope.foodB;
                    budgetLimit.miscB = $scope.miscB;
                    budgetLimit.optionalB = $scope.optionalB; 
                    checker++;
                }
            }
            if (checker===0) {
                var newBudget= angular.copy(BudgetService.budgetLimits); 
                newBudget.year = presentYear;
                newBudget.month = presentMonth;
                newBudget.fixedExpenseB = $scope.fixedExpenseB;
                newBudget.transportB = $scope.transportB;
                newBudget.utilitiesB = $scope.utilitiesB;
                newBudget.foodB = $scope.foodB;
                newBudget.miscB = $scope.miscB;
                newBudget.optionalB = $scope.optionalB;
                $scope.user.budgetLimits.push(newBudget);
            }
            if ($scope.user.budgetLimits.length!==0) {
                $scope.user.updatedBudget = true;
            }

            var userNow = new Users($scope.user);
            userNow.$update(function(response) {
                $scope.success = true;
                Authentication.user = response;
                $scope.user = Authentication.user;
            }, function(response) {
                $scope.error = response.data.message;
            });
            $scope.loadTables();
         };
        $scope.setTransportBudget = function() {                      

            var checker = 0;
            for (var ab=0; ab<$scope.user.budgetLimits.length; ab++) {
                var budgetLimit = $scope.user.budgetLimits[ab];
                if (budgetLimit.year===presentYear && budgetLimit.month ===presentMonth) {
                    budgetLimit.transportB = $scope.transportB;
                    checker++;
                }
            }
            if (checker===0) {
                var newBudget= angular.copy(BudgetService.budgetLimits); 
                newBudget.year = presentYear;
                newBudget.month = presentMonth;
                newBudget.transportB = $scope.transportB;
                $scope.user.budgetLimits.push(newBudget);
            }            
            if ($scope.user.budgetLimits.length!==0) {
                $scope.user.updatedBudget = true;
            }

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

            var checker = 0;
            for (var ab=0; ab<$scope.user.budgetLimits.length; ab++) {
                var budgetLimit = $scope.user.budgetLimits[ab];
                if (budgetLimit.year===presentYear && budgetLimit.month ===presentMonth) {
                    budgetLimit.utilitiesB = $scope.utilitiesB;
                    checker++;
                }
            }
            if (checker===0) {
                var newBudget= angular.copy(BudgetService.budgetLimits); 
                newBudget.year = presentYear;
                newBudget.month = presentMonth;
                newBudget.utilitiesB = $scope.utilitiesB;
                $scope.user.budgetLimits.push(newBudget);
            }
            if ($scope.user.budgetLimits.length!==0) {
                $scope.user.updatedBudget = true;
            }

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

            var checker = 0;
            for (var ab=0; ab<$scope.user.budgetLimits.length; ab++) {
                var budgetLimit = $scope.user.budgetLimits[ab];
                if (budgetLimit.year===presentYear && budgetLimit.month ===presentMonth) {
                    budgetLimit.foodB = $scope.foodB;
                    checker++;
                }
            }
            if (checker===0) {
                var newBudget= angular.copy(BudgetService.budgetLimits); 
                newBudget.year = presentYear;
                newBudget.month = presentMonth;
                newBudget.foodB = $scope.foodB;
                $scope.user.budgetLimits.push(newBudget);
            }
            if ($scope.user.budgetLimits.length!==0) {
                $scope.user.updatedBudget = true;
            }

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

            var checker = 0;
            for (var ab=0; ab<$scope.user.budgetLimits.length; ab++) {
                var budgetLimit = $scope.user.budgetLimits[ab];
                if (budgetLimit.year===presentYear && budgetLimit.month ===presentMonth) {
                    budgetLimit.miscB = $scope.miscB;
                    checker++;
                }
            }
            if (checker===0) {
                var newBudget= angular.copy(BudgetService.budgetLimits); 
                newBudget.year = presentYear;
                newBudget.month = presentMonth;
                newBudget.miscB = $scope.miscB;
                $scope.user.budgetLimits.push(newBudget);
            }
            if ($scope.user.budgetLimits.length!==0) {
                $scope.user.updatedBudget = true;
            }

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
                    var expenseSelected;
                    
                    if($scope.expenseType==='fixedExpense') {
                        expenseSelected = expenseRecord.monthlyExpense.fixedExpense;                                         
                    } else if($scope.expenseType==='transport') {
                        expenseSelected = expenseRecord.monthlyExpense.transport;
                    } else if($scope.expenseType==='utility') {
                        expenseSelected = expenseRecord.monthlyExpense.utilityHousehold;
                    } else if($scope.expenseType==='food') {
                        expenseSelected = expenseRecord.monthlyExpense.foodNecessities;
                    } else if($scope.expenseType==='misc') {
                        expenseSelected = expenseRecord.monthlyExpense.misc;
                    } else if($scope.expenseType==='optionalSavings') {
                        expenseSelected = expenseRecord.monthlyExpense.optionalSavings;
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
                                    obj.value = Number(obj.value) -itemNo;
                                    obj.value = obj.value.toFixed(2);
                                    obj.records.splice(a,1);
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
                        fixedExpenseTotal += Number(obj1.value);
                    }
                    expenseRecord.fixedExpenseAmt = fixedExpenseTotal.toFixed(2);

                    var transportArr = expenseRecord.monthlyExpense.transport;
                    var transportTotal = 0;
                    for (var rt1 in transportArr) {
                        var obj2 = transportArr[rt1];
                        transportTotal += Number(obj2.value);
                    }
                    expenseRecord.transportAmt = transportTotal.toFixed(2);

                    var utilityHouseholdArr = expenseRecord.monthlyExpense.utilityHousehold;
                    var utilityHouseholdTotal = 0;
                    for (var rt2 in utilityHouseholdArr) {
                        var obj3 = utilityHouseholdArr[rt2];
                        utilityHouseholdTotal += Number(obj3.value);
                    }
                    expenseRecord.utilityHouseholdAmt = utilityHouseholdTotal.toFixed(2);

                    var foodNecessitiesArr = expenseRecord.monthlyExpense.foodNecessities;
                    var foodNecessitiesTotal = 0;
                    for (var rt3 in foodNecessitiesArr) {
                        var obj4 = foodNecessitiesArr[rt3];
                        foodNecessitiesTotal += Number(obj4.value);
                    }
                    expenseRecord.foodNecessitiesAmt = foodNecessitiesTotal.toFixed(2);

                    var miscArr = expenseRecord.monthlyExpense.misc;
                    var miscTotal = 0;
                    for (var rt4 in miscArr) {
                        var obj5 = miscArr[rt4];
                        miscTotal += Number(obj5.value);
                    }
                    expenseRecord.miscAmt = miscTotal.toFixed(2);

                    var optionalArr = expenseRecord.monthlyExpense.optionalSavings;
                    var optionalTotal = 0;
                    for (var rt5 in optionalArr) {
                        var obj6 = optionalArr[rt5];
                        optionalTotal += Number(obj6.value);
                    }
                    expenseRecord.optionalSavingsAmt = optionalTotal.toFixed(2);



                    var monthlyIncomeAmt = Number(expenseRecord.monthlyIncomeAmt);                
                    var monthlyExpenseAmt = fixedExpenseTotal + transportTotal + utilityHouseholdTotal + foodNecessitiesTotal + miscTotal + optionalTotal;
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
        
        $scope.setFixedExpense = function(myType, amt) {
            $scope.expenseAmt = Number(amt);
            $scope.type = myType;
            $scope.selectedExpense = $scope.fixedExpense;
            $scope.formRef = 'fixedExpense';
        };
        
        $scope.setTransportExpense = function(myType, amt) {
            $scope.expenseAmt = Number(amt);
            $scope.type = myType;
            $scope.selectedExpense = $scope.transportExpense;
            $scope.formRef = 'transport';
        };
        $scope.setUtilityExpense = function(myType, amt) {
            $scope.expenseAmt = Number(amt);
            $scope.type = myType;
            $scope.selectedExpense = $scope.utilityExpense;
            $scope.formRef = 'utility';
        };
        $scope.setFoodExpense = function(myType, amt) {
            $scope.expenseAmt = Number(amt);
            $scope.type = myType;
            $scope.selectedExpense = $scope.foodExpense;
            $scope.formRef = 'food';
        };
        $scope.setMiscExpense = function(myType, amt) {
            $scope.expenseAmt = Number(amt);
            $scope.type = myType;
            $scope.selectedExpense = $scope.miscExpense;            
            $scope.formRef = 'misc';
        };
        $scope.setOptionalExpense = function(myType, amt) {
            $scope.expenseAmt = Number(amt);
            $scope.type = myType;
            $scope.selectedExpense = $scope.optionalExpense;            
            $scope.formRef = 'optionalSavings';
        };
        $scope.budgetView = function() {
            if ($scope.clickShow) {
                $scope.clickShow = false;
            }
            else {
                $scope.clickShow = true;
            }
        };
        $scope.$watch('category',function() {
            if($scope.category==='Fixed Expense') {                
                $scope.selectedExpense = $scope.fixedExpense;
                $scope.formRef = 'fixedExpense';
            }
            if($scope.category==='Transport') {
                $scope.selectedExpense = $scope.transportExpense;
                $scope.formRef = 'transport';
            }
            if($scope.category==='Food & Neccessities') {
                $scope.selectedExpense = $scope.foodExpense;
                $scope.formRef = 'food';
            }
            if($scope.category==='Miscellaneous') {
                $scope.selectedExpense = $scope.miscExpense; 
                $scope.formRef = 'misc';           
            }
            if($scope.category==='Utilities & Household Maintanence') {
                $scope.selectedExpense = $scope.utilityExpense;
                $scope.formRef = 'utility';
            }
            if($scope.category==='Optional Savings') {
                $scope.selectedExpense = $scope.optionalExpense;
                $scope.formRef = 'optionalSavings';
            }
        });
     }

]);