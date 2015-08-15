'use strict';

// Articles controller
angular.module('financial').controller('FinancesController', ['$scope', '$rootScope', '$stateParams', '$location', 'Authentication', 'LiabilitiesService', 'AssetsService', 'IncomeExpenseService','Users', '$q', 'FinancialHealthService',
	function($scope, $rootScope, $stateParams, $location, Authentication, LiabilitiesService, AssetsService, IncomeExpenseService,Users, $q, FinancialHealthService) {
		$scope.user = Authentication.user;
        //Check authentication
        if (!$scope.user) $location.path('/');


        $scope.displayHome = {};

        var numHealthyRatio = 0;
        var numUnHealthyRatio = 0;
        $scope.homeHealth = [{
            value: 100,
            type: 'info'
        }];
        $scope.homeHealthDisplay = false;
        $scope.homeHealthyRatioArr = [];
        $scope.homeUnHealthyRatioArr = [];

        //Set new record to N/A
        $scope.displayOverview ={};
        $scope.displayOverview.ratioLiquidity = 'N/A';
        $scope.displayOverview.ratioAssetDebt = 'N/A';
        $scope.displayOverview.ratioDebtService = 'N/A';
        $scope.displayOverview.ratioHouseExpense = 'N/A';
        $scope.displayOverview.ratioDebtIncome = 'N/A';
        $scope.displayOverview.ratioConsumerDebt = 'N/A';
        $scope.displayOverview.ratioNetWorthBenchmark = 'N/A';
        $scope.displayOverview.ratioSaving = 'N/A';
        $scope.displayOverview.ratioSolvency = 'N/A';
        $scope.displayOverview.ratioInvestment = 'N/A';

        //Set Checkbox Ratio
        $scope.checkRatio = {};
        $scope.checkRatio.liquidity =true;

        //Set Checkbox Overview
        $scope.checkTotal = {};
        $scope.checkTotal.assets = true;
        $scope.checkTotal.liabilities = true;
        $scope.checkTotal.netGrossIncome = true;

        //Financial health ratio tips & Analysis from Financial Health Service
        $scope.tips = FinancialHealthService.tips;
        $scope.analysisRatio = FinancialHealthService.analysisRatio;


        //Set display analysis
        $scope.displayAnalysis = {};

        this.$setScope = function(context) {
            $scope = context;
        };
        //Questions
        $scope.oneAtATime = false;

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

        //Charts Variables display time period
        $scope.selectedChartOption = '0';

        //Ratio Arrays
        var ratioLiquidityArr = [];
        var ratioAssetDebtArr = [];
        var ratioDebtServiceArr = [];
        var ratioHouseExpenseArr = [];
        var ratioDebtIncomeArr = [];
        var ratioConsumerDebtArr = [];
        var ratioLoanValueArr = [];
        var ratioTangibleNetWorthArr = [];
        var ratioNetWorthBenchmarkArr = [];
        var ratioSavingArr = [];
        var ratioSolvencyArr = [];
        var ratioInvestmentArr = [];

        //Change to reflect date change

        $scope.$watch('dt', function() {

            $scope.month = $scope.dt.getMonth();
            $scope.monthDisplay = mth[$scope.month];
            $scope.year = $scope.dt.getFullYear();

            //Run Function to retrieve latest records
            $scope.displayAssetsRecords = retrieveAssetsRecord($scope.month, $scope.year);
            $scope.displayLiabilitiesRecords = retrieveLiabilitiesRecords($scope.month, $scope.year);
            $scope.displayIncomeExpenseRecords = retrieveIncomeExpenseRecords($scope.month, $scope.year);
            
            $scope.displayOverview.totalAssets = $scope.displayAssetsRecords.totalAmt;
            $scope.displayOverview.totalLiabilities = $scope.displayLiabilitiesRecords.totalAmt;
            $scope.displayOverview.totalNetGrossIncome = $scope.displayIncomeExpenseRecords.netCashFlow;
            $scope.displayOverview.monthlyIncome = $scope.displayIncomeExpenseRecords.monthlyIncomeAmt;
            $scope.displayOverview.monthlyExpense = $scope.displayIncomeExpenseRecords.monthlyExpenseAmt;   
            calculateRatios();

            $scope.$watch('selectedChartOption', function() {
                updateChart();
            });
        });
        //Change time period of chart
        $scope.$watch('selectedChartOption', function() {

            updateChart();
        });

        //For Financial Health Page checkboxes
        $scope.$watch('checkRatio.liquidity', function() {

            updateChart();
        });
        $scope.$watch('checkRatio.assetDebt', function() {

            updateChart();
        });
        $scope.$watch('checkRatio.debtService', function() {

            updateChart();
        });
        $scope.$watch('checkRatio.houseExpense', function() {

            updateChart();
        });
        $scope.$watch('checkRatio.debtIncome', function() {

            updateChart();
        });
        $scope.$watch('checkRatio.consumerDebt', function() {

            updateChart();
        });
        $scope.$watch('checkRatio.netWorthBenchmark', function() {

            updateChart();
        });
        $scope.$watch('checkRatio.saving', function() {

            updateChart();
        });
        $scope.$watch('checkRatio.solvency', function() {

            updateChart();
        });
        $scope.$watch('checkRatio.investment', function() {
            
            updateChart();
        });

        //For Overview Page Checkboxes
        $scope.$watch('checkTotal.assets', function() {

            updateChart();
        });
        $scope.$watch('checkTotal.liabilities', function() {

            updateChart();
        });
        $scope.$watch('checkTotal.netGrossIncome', function() {
            updateChart();
        });
        $scope.$watch('checkTotal.monthlyIncome', function() {
            updateChart();
        });
        $scope.$watch('checkTotal.monthlyExpense', function() {
            updateChart();
        });
        var updateChart = function(){
            var ratioMthArr =[];
            var ratioMthNum;
            var ratioMth = angular.copy($scope.month);
            var ratioYear = angular.copy($scope.year);

            var aRecords;
            var lRecords;
            var ieRecords;   

            var aRecordsTotalAmtArr = [];
            var lRecordsTotalAmtArr = [];
            var ieRecordsTotalAmtArr = []; 
            var ieRecordsIncomeArr = [];
            var ieRecordsExpenseArr = [];         

            //for past 3 mth
            if($scope.selectedChartOption === '0'){
                ratioMthNum = 2;
                for(ratioMthNum; ratioMthNum >=0; ratioMthNum--){
                    ratioMthArr[ratioMthNum] = mth[ratioMth];
                    aRecords = retrieveAssetsRecord(ratioMth, ratioYear);
                    lRecords = retrieveLiabilitiesRecords(ratioMth, ratioYear);
                    ieRecords = retrieveIncomeExpenseRecords(ratioMth, ratioYear);

                    try{
                        aRecordsTotalAmtArr[ratioMthNum] = aRecords.totalAmt;
                    }catch(e){
                        aRecordsTotalAmtArr[ratioMthNum] = 0;
                    }

                    try{
                        lRecordsTotalAmtArr[ratioMthNum] = lRecords.totalAmt; 
                    }catch (e){
                        lRecordsTotalAmtArr[ratioMthNum] = 0;
                    }

                    try{
                        ieRecordsTotalAmtArr[ratioMthNum] = ieRecords.netCashFlow;
                    }catch(e){
                        ieRecordsTotalAmtArr[ratioMthNum] = 0;
                    }
                    try{
                        ieRecordsIncomeArr[ratioMthNum] = ieRecords.monthlyIncomeAmt;
                    }catch(e){
                        ieRecordsIncomeArr[ratioMthNum] = 0;
                    }
                    try{
                        ieRecordsExpenseArr[ratioMthNum] = ieRecords.monthlyExpenseAmt;
                    }catch(e){
                        ieRecordsExpenseArr[ratioMthNum] = 0;
                    }

                    calculateRatiosChart(aRecords, lRecords, ieRecords, ratioMthNum);    

                    ratioMth--;
                    if(ratioMth < 0){
                        ratioMth = 11;
                        ratioYear--;
                    }
        
                }
            //for past 6 mths   
            }else if($scope.selectedChartOption === '1'){
                ratioMthNum = 5;
                for(ratioMthNum; ratioMthNum >=0; ratioMthNum--){
                    ratioMthArr[ratioMthNum] = mth[ratioMth];
                    aRecords = retrieveAssetsRecord(ratioMth, ratioYear);
                    lRecords = retrieveLiabilitiesRecords(ratioMth, ratioYear);
                    ieRecords = retrieveIncomeExpenseRecords(ratioMth, ratioYear);

                    try{
                        aRecordsTotalAmtArr[ratioMthNum] = aRecords.totalAmt;
                    }catch(e){
                        aRecordsTotalAmtArr[ratioMthNum] = 0;
                    }

                    try{
                        lRecordsTotalAmtArr[ratioMthNum] = lRecords.totalAmt; 
                    }catch(e){
                        lRecordsTotalAmtArr[ratioMthNum] = 0;
                    }
                    
                    try{
                        ieRecordsTotalAmtArr[ratioMthNum] = ieRecords.netCashFlow;
                    }catch(e){
                        ieRecordsTotalAmtArr[ratioMthNum] = 0;
                    } 
                    try{
                        ieRecordsIncomeArr[ratioMthNum] = ieRecords.monthlyIncomeAmt;
                    }catch(e){
                        ieRecordsIncomeArr[ratioMthNum] = 0;
                    }
                    try{
                        ieRecordsExpenseArr[ratioMthNum] = ieRecords.monthlyExpenseAmt;
                    }catch(e){
                        ieRecordsExpenseArr[ratioMthNum] = 0;
                    }
                    calculateRatiosChart(aRecords, lRecords, ieRecords, ratioMthNum);   

                    ratioMth--;
                    if(ratioMth < 0){
                        ratioMth = 11;
                        ratioYear--;
                    }

                }
            //for past 12 mths
            }else if($scope.selectedChartOption === '2'){
                ratioMthNum = 11;
                for(ratioMthNum; ratioMthNum >=0; ratioMthNum--){
                    ratioMthArr[ratioMthNum] = mth[ratioMth];
                    aRecords = retrieveAssetsRecord(ratioMth, ratioYear);
                    lRecords = retrieveLiabilitiesRecords(ratioMth, ratioYear);
                    ieRecords = retrieveIncomeExpenseRecords(ratioMth, ratioYear);

                    try{
                        aRecordsTotalAmtArr[ratioMthNum] = aRecords.totalAmt;
                    }catch(e){
                        aRecordsTotalAmtArr[ratioMthNum] = 0;
                    }

                    try{
                        lRecordsTotalAmtArr[ratioMthNum] = lRecords.totalAmt; 
                    }catch(e){
                        lRecordsTotalAmtArr[ratioMthNum] = 0;
                    }
                    
                    try{
                        ieRecordsTotalAmtArr[ratioMthNum] = ieRecords.netCashFlow;
                    }catch(e){
                        ieRecordsTotalAmtArr[ratioMthNum] = 0;
                    }  
                    try{
                        ieRecordsIncomeArr[ratioMthNum] = ieRecords.monthlyIncomeAmt;
                    }catch(e){
                        ieRecordsIncomeArr[ratioMthNum] = 0;
                    }
                    try{
                        ieRecordsExpenseArr[ratioMthNum] = ieRecords.monthlyExpenseAmt;
                    }catch(e){
                        ieRecordsExpenseArr[ratioMthNum] = 0;
                    }
                    calculateRatiosChart(aRecords, lRecords, ieRecords, ratioMthNum);  

                    ratioMth--;
                    if(ratioMth < 0){
                        ratioMth = 11;
                        ratioYear--;
                    }

                }
            }

            //Add to ratio
            $scope.labels = ratioMthArr;
            $scope.series = [];
            $scope.data = [];    

            if($scope.checkRatio.liquidity){
                $scope.series.push('Liquidity');
                $scope.data.push(ratioLiquidityArr);
            }
            if($scope.checkRatio.assetDebt){
                $scope.series.push('Asset to Debt');
                $scope.data.push(ratioAssetDebtArr);
            }
            if($scope.checkRatio.debtService){
                $scope.series.push('Debt Service');
                $scope.data.push(ratioDebtServiceArr);
            }
            if($scope.checkRatio.houseExpense){
                $scope.series.push('Housing Expense');
                $scope.data.push(ratioHouseExpenseArr);
            }
            if($scope.checkRatio.debtIncome){
                $scope.series.push('Debt to Income');
                $scope.data.push(ratioDebtIncomeArr);
            }
            if($scope.checkRatio.consumerDebt){
                $scope.series.push('Consumer Debt');
                $scope.data.push(ratioConsumerDebtArr);
            }
            if($scope.checkRatio.loanValue){
                $scope.series.push('Loan to Value');
                $scope.data.push(ratioLoanValueArr);
            }
            if($scope.checkRatio.tangibleNetWorth){
                $scope.series.push('Tangible Net Worth');
                $scope.data.push(ratioTangibleNetWorthArr);
            }
            if($scope.checkRatio.netWorthBenchmark){
                $scope.series.push('Net Worth Benchmark');
                $scope.data.push(ratioNetWorthBenchmarkArr);
            }
            if($scope.checkRatio.saving){
                $scope.series.push('Saving');
                $scope.data.push(ratioSavingArr);
            }
            if($scope.checkRatio.solvency){
                $scope.series.push('Solvency');
                $scope.data.push(ratioSolvencyArr);
            }
            if($scope.checkRatio.investment){
                $scope.series.push('Investment');
                $scope.data.push(ratioInvestmentArr);
            }


            //Add to overview
            $scope.labelsOverview = ratioMthArr;
            $scope.seriesOverview = [];
            $scope.dataOverview = []; 

            if($scope.checkTotal.assets){
                $scope.seriesOverview.push('Assets');
                $scope.dataOverview.push(aRecordsTotalAmtArr);
            }
            if($scope.checkTotal.liabilities){
                $scope.seriesOverview.push('Liabilities');
                $scope.dataOverview.push(lRecordsTotalAmtArr);
            }
            if($scope.checkTotal.monthlyIncome){
                $scope.seriesOverview.push('Monthly Income');
                $scope.dataOverview.push(ieRecordsIncomeArr);
            }
            if($scope.checkTotal.monthlyExpense){
                $scope.seriesOverview.push('Monthly Expense');
                $scope.dataOverview.push(ieRecordsExpenseArr);
            }
            if($scope.checkTotal.netGrossIncome){
                $scope.seriesOverview.push('Net Gross Income');
                $scope.dataOverview.push(ieRecordsTotalAmtArr);
            }
        };


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
        
        var retrieveAssetsRecord = function(month, year){
            var displayAssetsRecords;
            if (!$scope.user.assetsRecordsPeriod || ($scope.user.assetsRecordsPeriod.minMonth > month && $scope.user.assetsRecordsPeriod.minYear >= year) || ($scope.user.assetsRecordsPeriod.minMonth < month && $scope.user.assetsRecordsPeriod.minYear > year)) {

                    displayAssetsRecords = AssetsService.assetsRecords;
                    displayAssetsRecords.year = angular.copy(year);
                    displayAssetsRecords.month = angular.copy(month);


            } else {

                if ($scope.user.assetsRecordsPeriod.minMonth === $scope.user.assetsRecordsPeriod.maxMonth && $scope.user.assetsRecordsPeriod.minYear === $scope.user.assetsRecordsPeriod.maxYear) {
                    displayAssetsRecords = angular.copy($scope.user.assetsRecords[0]);
                } else {
                    // IF there is multiple record

                    //TO review
                    var targetAssetsYear;
                    var targetAssetsMonth;
                    var minimumAssetsYear = $scope.user.assetsRecordsPeriod.minYear;
                    var minimumAssetsMonth = $scope.user.assetsRecordsPeriod.minMonth;
                    var maximumAssetsYear = $scope.user.assetsRecordsPeriod.maxYear;
                    var maximumAssetsMonth = $scope.user.assetsRecordsPeriod.maxMonth;

                    var latestAssetsYear = minimumAssetsYear;
                    var latestAssetsMonth = minimumAssetsMonth;
                    var latestAssetsRecord;

                    if (year > maximumAssetsYear || year === maximumAssetsYear && month >= maximumAssetsMonth) {
                        //Date after max
                        targetAssetsYear = maximumAssetsYear;
                        targetAssetsMonth = maximumAssetsMonth;
                        for (var rA1 in $scope.user.assetsRecords) {
                            if ($scope.user.assetsRecords[rA1].year === targetAssetsYear && $scope.user.assetsRecords[rA1].month === targetAssetsMonth) {
                                latestAssetsRecord = angular.copy($scope.user.assetsRecords[rA1]);
                            }
                        }
                    } else {
                        //Date in between
                        targetAssetsYear = year;
                        targetAssetsMonth = month;
                        for (var rA2 in $scope.user.assetsRecords) {
                            if ($scope.user.assetsRecords[rA2].year < targetAssetsYear || $scope.user.assetsRecords[rA2].year === targetAssetsYear && $scope.user.assetsRecords[rA2].month <= targetAssetsMonth) {
                                if ($scope.user.assetsRecords[rA2].year === latestAssetsYear && $scope.user.assetsRecords[rA2].month >= latestAssetsMonth) {
                                    latestAssetsRecord = angular.copy($scope.user.assetsRecords[rA2]);
                                    latestAssetsMonth = angular.copy($scope.user.assetsRecords[rA2].month);
                                } else if ($scope.user.assetsRecords[rA2].year > latestAssetsYear) {
                                    latestAssetsRecord = angular.copy($scope.user.assetsRecords[rA2]);
                                    latestAssetsMonth = angular.copy($scope.user.assetsRecords[rA2].month);
                                    latestAssetsYear = angular.copy($scope.user.assetsRecords[rA2].year);
                                }
                            }
                        }
                    }
                    displayAssetsRecords = latestAssetsRecord;
                }
            }
            return displayAssetsRecords;
        };

        var retrieveLiabilitiesRecords = function(month, year){
            var displayLiabilitiesRecords; 
            if (!$scope.user.liabilitiesRecordsPeriod || ($scope.user.liabilitiesRecordsPeriod.minMonth > month && $scope.user.liabilitiesRecordsPeriod.minYear >= year) || ($scope.user.liabilitiesRecordsPeriod.minMonth < month && $scope.user.liabilitiesRecordsPeriod.minYear > year)) {

                displayLiabilitiesRecords = LiabilitiesService.liabilitiesRecords;
                displayLiabilitiesRecords.year = angular.copy(year);
                displayLiabilitiesRecords.month = angular.copy(month);

            } else {

                if ($scope.user.liabilitiesRecordsPeriod.minMonth === $scope.user.liabilitiesRecordsPeriod.maxMonth && $scope.user.liabilitiesRecordsPeriod.minYear === $scope.user.liabilitiesRecordsPeriod.maxYear) {
                    displayLiabilitiesRecords = angular.copy($scope.user.liabilitiesRecords[0]);
                } else {
                    // IF there is multiple record
                    //TO review
                    var targetLiabilitiesYear;
                    var targetLiabilitiesMonth;
                    var minimumLiabilitiesYear = $scope.user.liabilitiesRecordsPeriod.minYear;
                    var minimumLiabilitiesMonth = $scope.user.liabilitiesRecordsPeriod.minMonth;
                    var maximumLiabilitiesYear = $scope.user.liabilitiesRecordsPeriod.maxYear;
                    var maximumLiabilitiesMonth = $scope.user.liabilitiesRecordsPeriod.maxMonth;

                    var latestLiabilitiesYear = minimumLiabilitiesYear;
                    var latestLiabilitiesMonth = minimumLiabilitiesMonth;
                    var latestLiabilitiesRecord;

                    if (year > maximumLiabilitiesYear || year === maximumLiabilitiesYear && month >= maximumLiabilitiesMonth) {
                        //Date after max
                        targetLiabilitiesYear = maximumLiabilitiesYear;
                        targetLiabilitiesMonth = maximumLiabilitiesMonth;
                        for (var rL1 in $scope.user.liabilitiesRecords) {
                            if ($scope.user.liabilitiesRecords[rL1].year === targetLiabilitiesYear && $scope.user.liabilitiesRecords[rL1].month === targetLiabilitiesMonth) {
                                latestLiabilitiesRecord = angular.copy($scope.user.liabilitiesRecords[rL1]);
                            }
                        }
                    } else {
                        //Date in between
                        targetLiabilitiesYear = year;
                        targetLiabilitiesMonth = month;
                        for (var rL2 in $scope.user.liabilitiesRecords) {
                            if ($scope.user.liabilitiesRecords[rL2].year < targetLiabilitiesYear || $scope.user.liabilitiesRecords[rL2].year === targetLiabilitiesYear && $scope.user.liabilitiesRecords[rL2].month <= targetLiabilitiesMonth) {
                                if ($scope.user.liabilitiesRecords[rL2].year === latestLiabilitiesYear && $scope.user.liabilitiesRecords[rL2].month >= latestLiabilitiesMonth) {
                                    latestLiabilitiesRecord = angular.copy($scope.user.liabilitiesRecords[rL2]);
                                    latestLiabilitiesMonth = angular.copy($scope.user.liabilitiesRecords[rL2].month);
                                } else if ($scope.user.liabilitiesRecords[rL2].year > latestLiabilitiesYear) {
                                    latestLiabilitiesRecord = angular.copy($scope.user.liabilitiesRecords[rL2]);
                                    latestLiabilitiesMonth = angular.copy($scope.user.liabilitiesRecords[rL2].month);
                                    latestLiabilitiesYear = angular.copy($scope.user.liabilitiesRecords[rL2].year);
                                }
                            }
                        }
                    }
                    displayLiabilitiesRecords = latestLiabilitiesRecord;
                }
            }
            return displayLiabilitiesRecords;
        };

        var retrieveIncomeExpenseRecords = function(month, year){
            var displayIncomeExpenseRecords;
            if (!$scope.user.incomeExpenseRecordsPeriod || ($scope.user.incomeExpenseRecordsPeriod.minMonth > month && $scope.user.incomeExpenseRecordsPeriod.minYear >= year) || ($scope.user.incomeExpenseRecordsPeriod.minMonth < month && $scope.user.incomeExpenseRecordsPeriod.minYear > year)) {

                displayIncomeExpenseRecords = IncomeExpenseService.incomeExpenseRecords;
                displayIncomeExpenseRecords.year = angular.copy(year);
                displayIncomeExpenseRecords.month = angular.copy(month);

            } else {

                if ($scope.user.incomeExpenseRecordsPeriod.minMonth === $scope.user.incomeExpenseRecordsPeriod.maxMonth && $scope.user.incomeExpenseRecordsPeriod.minYear === $scope.user.incomeExpenseRecordsPeriod.maxYear) {
                    displayIncomeExpenseRecords = angular.copy($scope.user.incomeExpenseRecords[0]);
                } else {
                    // IF there is multiple record

                    //TO review
                    var targetIEYear;
                    var targetIEMonth;
                    var minimumIEYear = $scope.user.incomeExpenseRecordsPeriod.minYear;
                    var minimumIEMonth = $scope.user.incomeExpenseRecordsPeriod.minMonth;
                    var maximumIEYear = $scope.user.incomeExpenseRecordsPeriod.maxYear;
                    var maximumIEMonth = $scope.user.incomeExpenseRecordsPeriod.maxMonth;

                    var latestIEYear = minimumIEYear;
                    var latestIEMonth = minimumIEMonth;
                    var latestIERecord;

                    if (year > maximumIEYear || year === maximumIEYear && month >= maximumIEMonth) {
                        //Date after max
                        targetIEYear = maximumIEYear;
                        targetIEMonth = maximumIEMonth;
                        for (var rIE1 in $scope.user.incomeExpenseRecords) {
                            if ($scope.user.incomeExpenseRecords[rIE1].year === targetIEYear && $scope.user.incomeExpenseRecords[rIE1].month === targetIEMonth) {
                                latestIERecord = angular.copy($scope.user.incomeExpenseRecords[rIE1]);
                            }
                        }
                    } else {
                        //Date in between
                        targetIEYear = year;
                        targetIEMonth = month;
                        for (var rIE2 in $scope.user.incomeExpenseRecords) {
                            if ($scope.user.incomeExpenseRecords[rIE2].year < targetIEYear || $scope.user.incomeExpenseRecords[rIE2].year === targetIEYear && $scope.user.incomeExpenseRecords[rIE2].month <= targetIEMonth) {
                                if ($scope.user.incomeExpenseRecords[rIE2].year === latestIEYear && $scope.user.incomeExpenseRecords[rIE2].month >= latestIEMonth) {
                                    latestIERecord = angular.copy($scope.user.incomeExpenseRecords[rIE2]);
                                    latestIEMonth = angular.copy($scope.user.incomeExpenseRecords[rIE2].month);
                                } else if ($scope.user.incomeExpenseRecords[rIE2].year > latestIEYear) {
                                    latestIERecord = angular.copy($scope.user.incomeExpenseRecords[rIE2]);
                                    latestIEMonth = angular.copy($scope.user.incomeExpenseRecords[rIE2].month);
                                    latestIEYear = angular.copy($scope.user.incomeExpenseRecords[rIE2].year);
                                }
                            }
                        }
                    }
                    displayIncomeExpenseRecords = latestIERecord;
                }
            }
            return displayIncomeExpenseRecords;
        };

        //for Current display
        var calculateRatios = function(){
            //Ratio Formula time
            //1) Liquidity Ratio
            var ratioLiquidity = angular.copy($scope.displayAssetsRecords.cashEquivalentsAmt) / angular.copy($scope.displayIncomeExpenseRecords.monthlyExpenseAmt);
            //2) Assets to Debt Ratio
            var ratioAssetDebt = $scope.displayAssetsRecords.totalAmt / $scope.displayLiabilitiesRecords.totalAmt;
            //3) Debt Service Ratio
            var ratioDebtService = $scope.displayLiabilitiesRecords.totalAmt / $scope.displayIncomeExpenseRecords.monthlyIncomeAmt;
            //4) Housing Expense Ratio
            var ratioHouseExpense = ($scope.displayIncomeExpenseRecords.monthlyExpenseAmt - $scope.displayIncomeExpenseRecords.fixedExpenseAmt) / $scope.displayIncomeExpenseRecords.netCashFlow;  
            //5) Debt Income Ratio
            var ratioDebtIncome;
            var mortgageRepaymentsValue;
            var rentalRepaymentsValue;
            var carLoanRepaymentValue;
            var otherLoanRepaymentsValue;
            try {
                mortgageRepaymentsValue = $scope.displayIncomeExpenseRecords.monthlyExpense.fixedExpense.mortgageRepayments.value;
            }catch (e){
                mortgageRepaymentsValue = 0;
            }
            try{
                rentalRepaymentsValue = $scope.displayIncomeExpenseRecords.monthlyExpense.fixedExpense.rentalRepaymentsValue.value;
            }catch(e){
                rentalRepaymentsValue = 0;
            }
            try{
                carLoanRepaymentValue = $scope.displayIncomeExpenseRecords.monthlyExpense.transport.carLoanRepayment.value;
            }catch (e) {
                carLoanRepaymentValue = 0;
            }
            try{
                otherLoanRepaymentsValue = $scope.displayIncomeExpenseRecords.monthlyExpense.fixedExpense.otherLoanRepayments.value;
            }catch(e){
                otherLoanRepaymentsValue = 0;
            }

            ratioDebtIncome = (mortgageRepaymentsValue + rentalRepaymentsValue + carLoanRepaymentValue + otherLoanRepaymentsValue) / $scope.displayIncomeExpenseRecords.netCashFlow;
            // if ($scope.displayIncomeExpenseRecords.monthlyExpense && $scope.displayIncomeExpenseRecords.monthlyExpense.fixedExpense && $scope.displayIncomeExpenseRecords.monthlyExpense.transport && $scope.displayIncomeExpenseRecords.monthlyExpense.fixedExpense.mortgageRepayments && $scope.displayIncomeExpenseRecords.monthlyExpense.fixedExpense.rentalRepayments && $scope.displayIncomeExpenseRecords.monthlyExpense.transport.carLoanRepayment && $scope.displayIncomeExpenseRecords.monthlyExpense.fixedExpense.otherLoanRepayments){
            //     ratioDebtIncome = ($scope.displayIncomeExpenseRecords.monthlyExpense.fixedExpense.mortgageRepayments.value + $scope.displayIncomeExpenseRecords.monthlyExpense.fixedExpense.rentalRepayments.value + $scope.displayIncomeExpenseRecords.monthlyExpense.transport.carLoanRepayment.value + $scope.displayIncomeExpenseRecords.monthlyExpense.fixedExpense.otherLoanRepayments.value)  /  $scope.displayIncomeExpenseRecords.netCashFlow;
            // }
             
            //6) Consumer Debt Ratio
            var ratioConsumerDebt = $scope.displayLiabilitiesRecords.shortTermCreditAmt / $scope.displayIncomeExpenseRecords.netCashFlow;
            //7) Net WorthBenchmark Ratio
            var ratioNetWorthBenchmark = ($scope.displayAssetsRecords.totalAmt - $scope.displayLiabilitiesRecords.totalAmt) / ($scope.user.age  * $scope.displayIncomeExpenseRecords.monthlyIncomeAmt * 12 / 10);
            //8) Saving Ratio
            var ratioSaving = $scope.displayIncomeExpenseRecords.monthlyIncomeAmt / $scope.displayIncomeExpenseRecords.netCashFlow;
            //9) Solvency Ratio
            var ratioSolvency = ($scope.displayAssetsRecords.totalAmt - $scope.displayLiabilitiesRecords.totalAmt) / $scope.displayAssetsRecords.totalAmt;
            //10) Investment Ratio
            var ratioInvestment;
            var privatePropertiesValue;
            try{
                privatePropertiesValue = $scope.displayAssetsRecords.investedAssets.privateProperties.value;
            }catch(e){
                privatePropertiesValue = 0;
            }      
            ratioInvestment = ($scope.displayAssetsRecords.cashEquivalentsAmt + $scope.displayAssetsRecords.investedAssetsAmt - privatePropertiesValue) / $scope.displayAssetsRecords.totalAmt;    
            // if($scope.displayAssetsRecords.investedAssets && $scope.displayAssetsRecords.investedAssets.privateProperties){
            //     ratioInvestment = ($scope.displayAssetsRecords.cashEquivalentsAmt + $scope.displayAssetsRecords.investedAssetsAmt - $scope.displayAssetsRecords.investedAssets.privateProperties.value) / $scope.displayAssetsRecords.totalAmt;
            // }

            //Assign Ratio to Scope
            //1)
            if(isFinite(ratioLiquidity)) {
                $scope.displayOverview.ratioLiquidity = ratioLiquidity.toFixed(2);
            }else {
                $scope.displayOverview.ratioLiquidity = 'N/A';
            }
            //2) 
            if(isFinite(ratioAssetDebt)) {
                $scope.displayOverview.ratioAssetDebt = ratioAssetDebt.toFixed(2);
            }else {
                $scope.displayOverview.ratioAssetDebt = 'N/A';
            }
            //3) 
            if(isFinite(ratioDebtService)) {
                $scope.displayOverview.ratioDebtService = ratioDebtService.toFixed(2);
            }else {
                $scope.displayOverview.ratioDebtService ='N/A';
            }
            //4)
            if(isFinite(ratioHouseExpense)) {
                $scope.displayOverview.ratioHouseExpense = ratioHouseExpense.toFixed(2);
            } else {
                $scope.displayOverview.ratioHouseExpense = 'N/A';
            }
            //5)
            if(isFinite(ratioDebtIncome)) {
                $scope.displayOverview.ratioDebtIncome = ratioDebtIncome.toFixed(2);
            }else{
                $scope.displayOverview.ratioDebtIncome = 'N/A';
            }
            //6)
            if(isFinite(ratioConsumerDebt)) {
                $scope.displayOverview.ratioConsumerDebt = ratioConsumerDebt.toFixed(2);
            }else{
                $scope.displayOverview.ratioConsumerDebt = 'N/A';
            }
            //7)
            if(isFinite(ratioNetWorthBenchmark)) {
                $scope.displayOverview.ratioNetWorthBenchmark = ratioNetWorthBenchmark.toFixed(2);
            } else {
                $scope.displayOverview.ratioNetWorthBenchmark = 'N/A';
            }
            //8)
            if(isFinite(ratioSaving)) {
                $scope.displayOverview.ratioSaving = ratioSaving.toFixed(2);
            }else{
                $scope.displayOverview.ratioSaving = 'N/A';
            }
            //9)
            if(isFinite(ratioSolvency)) {
                $scope.displayOverview.ratioSolvency = ratioSolvency.toFixed(2);
            }else{
                $scope.displayOverview.ratioSolvency = 'N/A';
            }
            //10)
            if(isFinite(ratioInvestment)) {
                $scope.displayOverview.ratioInvestment = ratioInvestment.toFixed(2);
            }else{
                $scope.displayOverview.ratioInvestment = 'N/A';
            }

            
            //Set analysis for each ratio
            //1)
            if($scope.displayOverview.ratioLiquidity !== 'N/A'){
                if($scope.displayOverview.ratioLiquidity < 3){
                    $scope.displayAnalysis.liquidity = $scope.analysisRatio.analysisLiquidity.unhealthy[0];
                    numUnHealthyRatio++;
                    $scope.homeUnHealthyRatioArr.push('Liquidity Ratio');
                }else if ($scope.displayOverview.ratioLiquidity >=3 && $scope.displayOverview.ratioLiquidity < 6){
                    $scope.displayAnalysis.liquidity = $scope.analysisRatio.analysisLiquidity.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Liquidity Ratio');
                }else if ($scope.displayOverview.ratioLiquidity >=6){
                    $scope.displayAnalysis.liquidity = $scope.analysisRatio.analysisLiquidity.healthy[1];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Liquidity Ratio');
                }
            }else{
                $scope.displayAnalysis.liquidity = 'Unable to generate ratio due to missing inputs';
            }
            //2)
            if($scope.displayOverview.ratioAssetDebt !== 'N/A'){
                if($scope.displayOverview.ratioAssetDebt < 0.4){
                    $scope.displayAnalysis.assetDebt = $scope.analysisRatio.analysisAssetDebt.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Asset to Debt Ratio');
                }else if($scope.displayOverview.ratioAssetDebt >=0.4 && $scope.displayOverview.ratioAssetDebt < 0.6){
                    $scope.displayAnalysis.assetDebt = $scope.analysisRatio.analysisAssetDebt.healthy[1];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Asset to Debt Ratio');
                }else if($scope.displayOverview.ratioAssetDebt >=0.6){
                    $scope.displayAnalysis.assetDebt = $scope.analysisRatio.analysisAssetDebt.unhealthy[0];
                    numUnHealthyRatio++;
                    $scope.homeUnHealthyRatioArr.push('Asset to Debt Ratio');
                }
            }else{
                $scope.displayAnalysis.assetDebt = 'Unable to generate ratio due to missing inputs';
            }
            //3)
            if($scope.displayOverview.ratioDebtService !== 'N/A'){
                if($scope.displayOverview.ratioDebtService <=0.36){
                    $scope.displayAnalysis.debtService = $scope.analysisRatio.analysisDebtService.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Debt Service Ratio');
                }else if($scope.displayOverview.ratioDebtService > 0.36){
                    $scope.displayAnalysis.debtService = $scope.analysisRatio.analysisDebtService.unhealthy[0];
                    numUnHealthyRatio++;
                    $scope.homeUnHealthyRatioArr.push('Debt Service Ratio');
                }
            }else{
                $scope.displayAnalysis.debtService = 'Unable to generate ratio due to missing inputs';
            }
            //4)
            if($scope.displayOverview.ratioHouseExpense !== 'N/A'){
                if($scope.displayOverview.ratioHouseExpense <=0.28){
                    $scope.displayAnalysis.houseExpense = $scope.analysisRatio.analysisHouseExpense.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Housing Expense Ratio');
                }else if($scope.displayOverview.ratioHouseExpense > 0.28){
                    $scope.displayAnalysis.houseExpense = $scope.analysisRatio.analysisHouseExpense.unhealthy[0];
                    numUnHealthyRatio++;
                    $scope.homeUnHealthyRatioArr.push('Housing Expense Ratio');
                }
            }else{
                $scope.displayAnalysis.houseExpense = 'Unable to generate ratio due to missing inputs';
            }
            //5)
            if($scope.displayOverview.ratioDebtIncome !== 'N/A'){
                if($scope.displayOverview.ratioDebtIncome <=0.4){
                    $scope.displayAnalysis.debtIncome = $scope.analysisRatio.analysisDebtIncome.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Debt to Income Ratio');
                }else if($scope.displayOverview.ratioDebtIncome > 0.4){
                    $scope.displayAnalysis.debtIncome = $scope.analysisRatio.analysisDebtIncome.unhealthy[0];
                    numUnHealthyRatio++;
                    $scope.homeUnHealthyRatioArr.push('Debt to Income Ratio');
                }
            }else{
                $scope.displayAnalysis.debtIncome = 'Unable to generate ratio due to missing inputs';
            }            
            //6)
            if($scope.displayOverview.ratioConsumerDebt !== 'N/A'){
                if($scope.displayOverview.ratioConsumerDebt <=0.2){
                    $scope.displayAnalysis.consumerDebt = $scope.analysisRatio.analysisConsumerDebt.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Consumer Debt Ratio');
                }else if($scope.displayOverview.ratioConsumerDebt > 0.2){
                    $scope.displayAnalysis.consumerDebt = $scope.analysisRatio.analysisConsumerDebt.unhealthy[0];
                    numUnHealthyRatio++;
                    $scope.homeUnHealthyRatioArr.push('Consumer Debt Ratio');
                }
            }else{
                $scope.displayAnalysis.consumerDebt = 'Unable to generate ratio due to missing inputs';
            } 
            //7)
            if($scope.displayOverview.ratioNetWorthBenchmark !== 'N/A'){
                if($scope.displayOverview.ratioNetWorthBenchmark <=0.75){
                    $scope.displayAnalysis.netWorthBenchmark = $scope.analysisRatio.analysisNetWorthBenchmark.unhealthy[0];
                    numUnHealthyRatio++;
                    $scope.homeUnHealthyRatioArr.push('Net Worth Benchmark');
                }else if($scope.displayOverview.ratioNetWorthBenchmark >0.75 && $scope.displayOverview.ratioNetWorthBenchmark <=1){
                    $scope.displayAnalysis.netWorthBenchmark = $scope.analysisRatio.analysisNetWorthBenchmark.healthy[1];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Net Worth Benchmark');
                }else if($scope.displayOverview.ratioNetWorthBenchmark > 1){
                    $scope.displayAnalysis.netWorthBenchmark = $scope.analysisRatio.analysisNetWorthBenchmark.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Net Worth Benchmark');
                }
            }else{
                $scope.displayAnalysis.netWorthBenchmark = 'Unable to generate ratio due to missing inputs';
            }
            //8)
            if($scope.displayOverview.ratioSaving !== 'N/A'){
                if($scope.displayOverview.ratioSaving <0.12){
                    $scope.displayAnalysis.saving = $scope.analysisRatio.analysisSaving.unhealthy[0];
                    numUnHealthyRatio++; 
                    $scope.homeUnHealthyRatioArr.push('Saving Ratio');
                }else if($scope.displayOverview.ratioSaving >=0.12 && $scope.displayOverview.ratioSaving <=0.7){
                    $scope.displayAnalysis.saving = $scope.analysisRatio.analysisSaving.healthy[1];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Saving Ratio');
                }else if($scope.displayOverview.ratioSaving > 0.7){
                    $scope.displayAnalysis.saving = $scope.analysisRatio.analysisSaving.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Saving Ratio');
                }
            }else{
                $scope.displayAnalysis.saving = 'Unable to generate ratio due to missing inputs';
            }
            //9)
            if($scope.displayOverview.ratioSolvency !== 'N/A'){
                if($scope.displayOverview.ratioSolvency <=0.2){
                    $scope.displayAnalysis.solvency = $scope.analysisRatio.analysisSolvency.unhealthy[0];
                    numUnHealthyRatio++;
                    $scope.homeUnHealthyRatioArr.push('Solvency Ratio');
                }else if($scope.displayOverview.ratioSolvency > 0.2){
                    $scope.displayAnalysis.solvency = $scope.analysisRatio.analysisSolvency.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Solvency Ratio');
                }
            }else{
                $scope.displayAnalysis.solvency = 'Unable to generate ratio due to missing inputs';
            } 
            //10)
            if($scope.displayOverview.ratioInvestment !== 'N/A'){
                if($scope.displayOverview.ratioInvestment <=0.2){
                    $scope.displayAnalysis.investment = $scope.analysisRatio.analysisInvestment.unhealthy[0];
                    numUnHealthyRatio++;
                    $scope.homeUnHealthyRatioArr.push('Investment Ratio');
                }else if($scope.displayOverview.ratioInvestment > 0.2){
                    $scope.displayAnalysis.investment = $scope.analysisRatio.analysisInvestment.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Investment Ratio');
                }
            }else{
                $scope.displayAnalysis.investment = 'Unable to generate ratio due to missing inputs';
            } 

            //Render ratio to home page
            

            $scope.homeHealthDisplay = true;
            $scope.homeHealth = [{value: (numHealthyRatio*10), type: 'success'}, {value: (numUnHealthyRatio*10), type:'danger'}];

        };

        //for chart display
        var calculateRatiosChart = function(aRecords, lRecords, ieRecords, ratioMthNum){
            aRecords = aRecords;
            lRecords = lRecords;
            ieRecords = ieRecords;
            
            //Ratio Formula time
            //1) Liquidity Ratio
            var ratioLiquidityChart = aRecords.cashEquivalentsAmt / ieRecords.monthlyExpenseAmt;
            //2) Assets to Debt Ratio
            var ratioAssetDebtChart = aRecords.totalAmt / lRecords.totalAmt;
            //3) Debt Service Ratio
            var ratioDebtServiceChart = lRecords.totalAmt / ieRecords.monthlyIncomeAmt;
            //4) Housing Expense Ratio
            var ratioHouseExpenseChart = (ieRecords.monthlyExpenseAmt - ieRecords.fixedExpenseAmt) / ieRecords.netCashFlow; 
            //5) Debt Income Ratio
            var ratioDebtIncomeChart;
            var mortgageRepaymentsChartValue;
            var rentalRepaymentsChartValue;
            var carLoanRepaymentChartValue;
            var otherLoanRepaymentsChartValue;
            try{
                mortgageRepaymentsChartValue = ieRecords.monthlyExpense.fixedExpense.mortgageRepayments.value;
            }catch(e){
                mortgageRepaymentsChartValue = 0;
            }
            try{
                rentalRepaymentsChartValue = ieRecords.monthlyExpense.fixedExpense.rentalRepayments.value;
            } catch(e) {
                rentalRepaymentsChartValue = 0;
            }
            try{
                carLoanRepaymentChartValue = ieRecords.monthlyExpense.transport.carLoanRepayment.value;
            }catch(e){
                carLoanRepaymentChartValue = 0;
            }
            try{
                otherLoanRepaymentsChartValue = ieRecords.monthlyExpense.fixedExpense.otherLoanRepayments.value;
            }catch(e){
                otherLoanRepaymentsChartValue = 0;
            }
            ratioDebtIncomeChart = (mortgageRepaymentsChartValue + rentalRepaymentsChartValue + carLoanRepaymentChartValue + otherLoanRepaymentsChartValue) / ieRecords.netCashFlow;
            // if(ieRecords.monthlyExpense && ieRecords.monthlyExpense.fixedExpense && ieRecords.monthlyExpense.transport && ieRecords.monthlyExpense.fixedExpense.mortgageRepayments && ieRecords.monthlyExpense.fixedExpense.rentalRepayments && ieRecords.monthlyExpense.transport.carLoanRepayment && ieRecords.monthlyExpense.fixedExpense.otherLoanRepayments){
            //     ratioDebtIncomeChart = (ieRecords.monthlyExpense.fixedExpense.mortgageRepayments.value + ieRecords.monthlyExpense.fixedExpense.rentalRepayments.value + ieRecords.monthlyExpense.transport.carLoanRepayment.value + ieRecords.monthlyExpense.fixedExpense.otherLoanRepayments.value)  /  ieRecords.netCashFlow;
            // }
            //6) Consumer Debt Ratio
            var ratioConsumerDebtChart = lRecords.shortTermCreditAmt / ieRecords.netCashFlow;
            //7) Net WorthBenchmark Ratio
            var ratioNetWorthBenchmarkChart = (aRecords.totalAmt - lRecords.totalAmt) / ($scope.user.age  * ieRecords.monthlyIncomeAmt * 12 / 10);
            //8) Saving Ratio
            var ratioSavingChart = ieRecords.monthlyIncomeAmt / ieRecords.netCashFlow;
            //9) Solvency Ratio
            var ratioSolvencyChart = (aRecords.totalAmt - lRecords.totalAmt) / aRecords.totalAmt;
            //10) Investment Ratio
            var ratioInvestmentChart;
            var privatePropertiesChartValue;
            try{
                privatePropertiesChartValue = aRecords.investedAssets.privateProperties.value;
            }catch(e){
                privatePropertiesChartValue = 0;
            }      
            ratioInvestmentChart = (aRecords.cashEquivalentsAmt + aRecords.investedAssetsAmt - privatePropertiesChartValue) / aRecords.totalAmt; 
            // if(aRecords.investedAssets && aRecords.investedAssets.privateProperties){
            //     ratioDebtIncomeChart = (aRecords.cashEquivalentsAmt + aRecords.investedAssetsAmt - aRecords.investedAssets.privateProperties.value) / aRecords.totalAmt;
            // }
            

            //Assign Ratio to Scope
            if(isFinite(ratioLiquidityChart)) {
                ratioLiquidityArr[ratioMthNum] = Number(ratioLiquidityChart.toFixed(2));
            } else{
                ratioLiquidityArr[ratioMthNum] = 0;
            }
            if(isFinite(ratioAssetDebtChart)) {
                ratioAssetDebtArr[ratioMthNum] = Number(ratioAssetDebtChart.toFixed(2));
            } else{
                ratioAssetDebtArr[ratioMthNum] = 0;
            }
            if(isFinite(ratioDebtServiceChart)) {
                ratioDebtServiceArr[ratioMthNum] = Number(ratioDebtServiceChart.toFixed(2));
            } else {
                ratioDebtServiceArr[ratioMthNum] = 0;
            }
            if(isFinite(ratioHouseExpenseChart)) {
                ratioHouseExpenseArr[ratioMthNum] = Number(ratioHouseExpenseChart.toFixed(2));
            } else{
                ratioHouseExpenseArr[ratioMthNum] = 0;
            }
            if(isFinite(ratioDebtIncomeChart)) {
                ratioDebtIncomeArr[ratioMthNum] = Number(ratioDebtIncomeChart.toFixed(2));
            } else {
                ratioDebtIncomeArr[ratioMthNum] = 0;
            }
            if(isFinite(ratioConsumerDebtChart)) {
                ratioConsumerDebtArr[ratioMthNum] = Number(ratioConsumerDebtChart.toFixed(2));
            }else {
                ratioConsumerDebtArr[ratioMthNum] = 0;
            }
            if(isFinite(ratioNetWorthBenchmarkChart)) {
                ratioNetWorthBenchmarkArr[ratioMthNum] = Number(ratioNetWorthBenchmarkChart.toFixed(2));
            }else {
                ratioNetWorthBenchmarkArr[ratioMthNum] = 0;
            }
            if(isFinite(ratioSavingChart)) {
                ratioSavingArr[ratioMthNum] = Number(ratioSavingChart.toFixed(2));
            } else{
                ratioSavingArr[ratioMthNum] = 0;
            }
            if(isFinite(ratioSolvencyChart)) {
                ratioSolvencyArr[ratioMthNum] = Number(ratioSolvencyChart.toFixed(2));
            } else {
                ratioSolvencyArr[ratioMthNum] = 0;
            }
            if(isFinite(ratioInvestmentChart)) {
                ratioInvestmentArr[ratioMthNum] = Number(ratioInvestmentChart.toFixed(2));
            } else{
                ratioInvestmentArr[ratioMthNum] = 0;
            }

        };
	}
]);