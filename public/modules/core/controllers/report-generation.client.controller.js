'use strict';

angular.module('core').controller('ReportGenerationController', ['$rootScope', '$scope', 'Authentication', 'Menus', '$http', '$state', '$window', 'LiabilitiesService', 'AssetsService', 'IncomeExpenseService', 'FinancialHealthService', 'CreditService', 'ReportGenerationService', '$timeout',
	function($rootScope, $scope, Authentication, Menus, $http, $state, $window, LiabilitiesService, AssetsService, IncomeExpenseService, FinancialHealthService, CreditService, ReportGenerationService, $timeout) {
		$scope.authentication = Authentication;
		$scope.user = Authentication.user;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');


		$scope.redirectHome = '/#!/';
		if($scope.user) $scope.redirectHome = '/#!/home';
		if(!$scope.user) $scope.redirectHome = '/#!/';


		// 
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
        $scope.current = function() {
            $scope.dt = new Date();
            $scope.month = $scope.dt.getMonth();
            $scope.year = Number($scope.dt.getFullYear());
            $scope.monthDisplay = $scope.selectedMonthReport;


            $scope.selectedMonthReport = $scope.monthArr[$scope.month];

            $scope.selectedYearReport = $scope.year;
        };


        // this.$setScope = function(context) {
        //     $scope = context;
        // };
        
        // $scope.ReportGenerationService = ReportGenerationService;

        // console.log(ReportGenerationService);
        //PRINT


		// ReportGenerationService.month;
        //Retrieve from the reportController    

		$scope.displayHome = {};
        $scope.homeHealth = [{
            value: 100,
            type: 'info'
        }];
        $scope.homeHealthDisplay = false;

        //Set new record to N/A
        $scope.displayOverview ={};

        //1---Liquidity---
        //Liquidity Ratio
        $scope.displayOverview.ratioLiquidity = 'N/A';
        //Total Liquidity Ratio
        $scope.displayOverview.ratioTotalLiquidity = 'N/A';

        //2---Savings---
        //Surplus Income Ratio /Savings Ratio
        $scope.displayOverview.ratioSaving = 'N/A';
        //Basic Saving Ratio
        $scope.displayOverview.ratioBasicSaving = 'N/A';

        //3---Expenses---
        //Essential Expenses to Income Ratio
        $scope.displayOverview.ratioEssentialExpenses = 'N/A';
        //Lifestyle Expenses to Income Ratio
        $scope.displayOverview.ratioLifestyleExpenses = 'N/A';

        //4---Debt---
        //AssetDebt Ratio
        $scope.displayOverview.ratioAssetDebt = 'N/A';
        //DebtService Ratio
        $scope.displayOverview.ratioDebtService = 'N/A';
        //Housing Expense Ratio
        $scope.displayOverview.ratioHouseExpense = 'N/A';
        //Debt to Income Ratio
        $scope.displayOverview.ratioDebtIncome = 'N/A';
        //Consumer Debt Ratio
        $scope.displayOverview.ratioConsumerDebt = 'N/A';

        //5---Net Worth/ Others---
        //Net Worth Benchmark
        $scope.displayOverview.ratioNetWorthBenchmark = 'N/A';
        //Solvency Ratio
        $scope.displayOverview.ratioSolvency = 'N/A';

        //6---Asset vs Debts
        //Current Asset to Debt Ratio
        $scope.displayOverview.ratioCurrentAssetDebt = 'N/A';
        //Investment Ratio
        $scope.displayOverview.ratioInvestment = 'N/A';


        //Set Checkbox Overview
        $scope.checkTotal = {};
        $scope.checkTotal.assets = true;
        $scope.checkTotal.liabilities = true;
        $scope.checkTotal.netGrossIncome = true;
        $scope.checkTotal.monthlyIncome = true;
        $scope.checkTotal.monthlyExpense = true;
        $scope.checkTotal.netWorth = true;

        //Financial health ratio tips & Analysis from Financial Health Service
        $scope.tips = FinancialHealthService.tips;
        $scope.analysisRatio = FinancialHealthService.analysisRatio;

        //Set display analysis
        $scope.displayAnalysis = {};

        $scope.rankIcon = './img/rank/diamond0.jpg';

        if(!$scope.user.currentCreditRating) $scope.user.currentCreditRating = 0;
        $scope.creditGrade = CreditService.creditGrade($scope.user.currentCreditRating);
        if($scope.creditGrade[0] === 'D'){
            $scope.rankIcon = './img/rank/diamond2.png';
        } else if($scope.creditGrade[0] === 'C'){
            $scope.rankIcon = './img/rank/diamond3.png';
        } else if($scope.creditGrade[0] === 'B'){
            $scope.rankIcon = './img/rank/diamond4.png';
        } else if($scope.creditGrade[0] === 'A'){
            $scope.rankIcon = './img/rank/diamond5.png';
        }

        //--DATE Selected
        $scope.monthShortArr = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ];

        // var current = function() {
        //     $scope.dt = new Date();
        //     $scope.month = $scope.dt.getMonth();
        //     $scope.year = Number($scope.dt.getFullYear());
        //     $scope.monthDisplay = $scope.selectedMonth;
        //     console.log($scope.month);
        //     console.log($scope.year);

        //     $scope.selectedMonth = $scope.monthArr[$scope.month];
        //     console.log($scope.selectedMonth);
        //     $scope.selectedYear = $scope.year;
        // };


        // current();

        //Charts Variables display time period
        // $scope.selectedChartOption = '1';

        //Ratio Arrays
        //1---Liquidity---
        //Liquidity Ratio
        var ratioLiquidityArr = [];
        var ratioIdealLiquidityMinArr = [];
        var ratioIdealLiquidityMaxArr = [];
        //Total Liquidity Ratio
        var ratioTotalLiquidityArr = [];
        var ratioIdealTotalLiquidityMinArr = [];
        var ratioIdealTotalLiquidityMaxArr = [];

        //2---Savings---
        //Surplus Income Ratio /Savings Ratio
        var ratioSavingArr = [];
        var ratioIdealSavingMinArr = [];
        var ratioIdealSavingMaxArr = [];
        //Basic Saving Ratio
        var ratioBasicSavingArr = [];
        var ratioIdealBasicSavingMinArr = [];
        var ratioIdealBasicSavingMaxArr = [];

        //3---Expenses---
        //Essential Expenses to Income Ratio
        var ratioEssentialExpensesArr = [];
        var ratioIdealEssentialExpensesMinArr = [];
        var ratioIdealEssentialExpensesMaxArr = [];
        //Lifestyle Expenses to Income Ratio
        var ratioLifestyleExpensesArr = [];
        var ratioIdealLifestyleExpensesMinArr = [];
        var ratioIdealLifestyleExpensesMaxArr = [];

        //4---Debt---
        //AssetDebt Ratio
        var ratioAssetDebtArr = [];
        var ratioIdealAssetDebtMinArr = [];
        var ratioIdealAssetDebtMaxArr = [];
        //DebtService Ratio
        var ratioDebtServiceArr = [];
        var ratioIdealDebtServiceMinArr = [];
        var ratioIdealDebtServiceMaxArr = [];
        //Housing Expense Ratio
        var ratioHouseExpenseArr = [];
        var ratioIdealHouseExpenseMinArr = [];
        var ratioIdealHouseExpenseMaxArr = [];
        //Debt to Income Ratio
        var ratioDebtIncomeArr = [];
        var ratioIdealDebtIncomeMinArr = [];
        var ratioIdealDebtIncomeMaxArr = [];
        //Consumer Debt Ratio
        var ratioConsumerDebtArr = [];
        var ratioIdealConsumerDebtMinArr = [];
        var ratioIdealConsumerDebtMaxArr = [];

        //5---Net Worth/ Others--- 
        //Net Worth Benchmark
        var ratioNetWorthBenchmarkArr = [];
        var ratioIdealNetWorthBenchmarkMinArr = [];
        var ratioIdealNetWorthBenchmarkMaxArr = [];
        //Solvency Ratio
        var ratioSolvencyArr = [];
        var ratioIdealSolvencyMinArr = [];
        var ratioIdealSolvencyMaxArr = [];

        //6---Asset vs Debts
        //Current Asset to Debt Ratio
        var ratioCurrentAssetDebtArr = [];
        var ratioIdealCurrentAssetDebtMinArr = [];
        var ratioIdealCurrentAssetDebtMaxArr = [];
        //Investment Ratio
        var ratioInvestmentArr = [];
        var ratioIdealInvestmentMinArr = [];
        var ratioIdealInvestmentMaxArr = [];

        //Change to reflect date change
        // $scope.$watch('selectedMonth', function(){
        //     retrieveLatestRecords();
        //     updateChart();

        // });
        // $scope.$watch('selectedYear', function(){
        //     retrieveLatestRecords();
        //     updateChart();
        // });

        // $scope.$watch('selectedReportOption', function(){
        // 	retrieveLatestRecords();
        // 	updateChart();
        // });

        var retrieveLatestRecords = function(){

            $scope.month = $scope.monthArr.indexOf($scope.selectedMonthReport);
            $scope.monthDisplay = $scope.selectedMonthReport;
            $scope.year = $scope.selectedYearReport;

            //Run Function to retrieve latest records
            $scope.displayAssetsRecords = retrieveAssetsRecord($scope.month, $scope.year);
            $scope.displayLiabilitiesRecords = retrieveLiabilitiesRecords($scope.month, $scope.year);
            $scope.displayIncomeExpenseRecords = retrieveIncomeExpenseRecords($scope.month, $scope.year);
            
            $scope.displayOverview.totalAssets = Number($scope.displayAssetsRecords.totalAmt).toFixed(2);
            $scope.displayOverview.totalLiabilities = Number($scope.displayLiabilitiesRecords.totalAmt).toFixed(2);
            $scope.displayOverview.netWorth = Number($scope.displayAssetsRecords.totalAmt - $scope.displayLiabilitiesRecords.totalAmt).toFixed(2);
            $scope.displayOverview.totalNetGrossIncome = Number($scope.displayIncomeExpenseRecords.netCashFlow).toFixed(2);
            $scope.displayOverview.monthlyIncome = Number($scope.displayIncomeExpenseRecords.monthlyIncomeAmt).toFixed(2);
            $scope.displayOverview.monthlyExpense = Number($scope.displayIncomeExpenseRecords.monthlyExpenseAmt).toFixed(2);   
            calculateRatios();

        };
        

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
            var netWorthTotalAmtArr = [];
            var ieRecordsTotalAmtArr = []; 
            var ieRecordsIncomeArr = [];
            var ieRecordsExpenseArr = [];

            //liquidity
            $scope.liquidityRatioTable = [];
            $scope.liquidityTotalTable = [];
            //Savings Ratios
            $scope.surplusIncomeTable = [];
            $scope.basicSavingTable = [];
            //Expenses Ratios
            $scope.essentialExpensesTable = [];
            $scope.lifestyleExpensesTable = [];
            //debt ratios
            $scope.totalDebtToAnnualIncomeTable = [];
            $scope.currentDebtToAnnualIncomeTable = [];
            $scope.propertyDebtToTotalIncomeTable = [];
            $scope.monthlyDebtServicingToIncomeTable = [];
            $scope.monthlyCreditCardToIncomeTable = [];
            //Net worth & other ratios
            $scope.netWorthBenchmarkTable = [];
            $scope.solvencyTable = [];
            //Asset to Debt Ratio            
            $scope.assetToDebtTable = [];
            $scope.investmentTable = [];

            $scope.dateRecords = [];

            //for past 12 mths
            ratioMthNum = 11;
            if($scope.selectedReportOption === '0'){
                ratioMthNum = 2;
            }else if($scope.selectedReportOption === '1'){
                ratioMthNum = 5;
            }else if($scope.selectedReportOption === '2'){
            	ratioMthNum = 11;
            }

           // if($scope.selectedChartOption === '2') {
                // ratioMthNum = 11;
                for(ratioMthNum; ratioMthNum >=0; ratioMthNum--){
                    ratioMthArr[ratioMthNum] = $scope.monthArr[ratioMth];
                    aRecords = retrieveAssetsRecord(ratioMth, ratioYear);
                    lRecords = retrieveLiabilitiesRecords(ratioMth, ratioYear);
                    ieRecords = retrieveIncomeExpenseRecords(ratioMth, ratioYear);
                    var year = ratioYear.toString().substr(2,2);
                    var dateRecord = $scope.monthShortArr[ratioMth]+','+year; 
                    $scope.dateRecords.push(dateRecord);

                    calculateRatiosTable(aRecords, lRecords, ieRecords);
                    

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
                        netWorthTotalAmtArr[ratioMthNum] = (aRecords.totalAmt - lRecords.totalAmt).toFixed(2);
                    }catch(e){
                        netWorthTotalAmtArr[ratioMthNum] = 0;
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
                
                $scope.liquidityRatioTable.reverse();
                $scope.liquidityTotalTable.reverse();
                //Savings Ratios
                $scope.surplusIncomeTable.reverse();
                $scope.basicSavingTable.reverse();
                //Expenses Ratios
                $scope.essentialExpensesTable.reverse();
                $scope.lifestyleExpensesTable.reverse();
                //debt ratios
                $scope.totalDebtToAnnualIncomeTable.reverse();
                $scope.currentDebtToAnnualIncomeTable.reverse();
                $scope.propertyDebtToTotalIncomeTable.reverse();
                $scope.monthlyDebtServicingToIncomeTable.reverse();
                $scope.monthlyCreditCardToIncomeTable.reverse();
                //Net worth & other ratios
                $scope.netWorthBenchmarkTable.reverse();
                $scope.solvencyTable.reverse();
                //Asset to Debt Ratio            
                $scope.assetToDebtTable.reverse();
                $scope.investmentTable.reverse();

                $scope.dateRecords.reverse();

            // }

            //Add to ratio
            $scope.labels = ratioMthArr;
            $scope.series = [];
            $scope.data = [];    
		    $scope.check = {
		        ratio: 'liquidity'
		    };
            //1 Liquidity Ratio
            //Liquidity Ratio
            if($scope.check.ratio === 'liquidity'){
                $scope.series.push('Min Ideal Ratio', 'Max Ideal Ratio', 'Current Liquidity Ratio');
                $scope.data.push(ratioIdealLiquidityMinArr, ratioIdealLiquidityMaxArr, ratioLiquidityArr);
            }
            //Total Liquidity Ratio
            if($scope.check.ratio === 'totalLiquidity'){
                $scope.series.push('Min Ideal Ratio', 'Total Liquidity Ratio');
                $scope.data.push(ratioIdealTotalLiquidityMinArr, ratioTotalLiquidityArr);
            }
            //2 Savings Ratio
            //Surplus Income Ratio /Savings Ratio
            if($scope.check.ratio === 'saving'){
                $scope.series.push('Min Ideal Ratio', 'Max Ideal Ratio','Surplus Income Ratio');
                $scope.data.push(ratioIdealSavingMinArr, ratioIdealSavingMaxArr,ratioSavingArr);
            }
            //Basic Saving Ratio
            if($scope.check.ratio === 'basicSaving'){
                $scope.series.push('Min Ideal Ratio', 'Basic Saving Ratio');
                $scope.data.push(ratioIdealBasicSavingMinArr, ratioBasicSavingArr);
            }

            //3 Expenses Ratio
            //Essential Expenses to Income Ratio
            if($scope.check.ratio === 'essentialExpenses'){
                $scope.series.push('Max Ideal Ratio','Essential Expenses to Income Ratio');
                $scope.data.push(ratioIdealEssentialExpensesMaxArr, ratioEssentialExpensesArr);
            }
            //Lifestyle Expenses to Income Ratio
            if($scope.check.ratio === 'lifestyleExpenses'){
                $scope.series.push('Max Ideal Ratio','Lifestyle Expenses to Income Ratio');
                $scope.data.push(ratioIdealLifestyleExpensesMaxArr, ratioLifestyleExpensesArr);
            }

            //4 Debt Ratios
            //AssetDebt Ratio
            if($scope.check.ratio === 'assetDebt'){
                $scope.series.push('Min Ideal Ratio', 'Max Ideal Ratio','Total Debt to Annual Income Ratio');
                $scope.data.push(ratioIdealAssetDebtMinArr, ratioIdealAssetDebtMaxArr,ratioAssetDebtArr);
            }
            //DebtService Ratio
            if($scope.check.ratio === 'debtService'){
                $scope.series.push('Min Ideal Ratio', 'Max Ideal Ratio','Current Debt to Annual Income Ratio');
                $scope.data.push(ratioIdealDebtServiceMinArr, ratioIdealDebtServiceMaxArr,ratioDebtServiceArr);
            }
            //Housing Expense Ratio
            if($scope.check.ratio === 'houseExpense'){
                $scope.series.push('Min Ideal Ratio', 'Max Ideal Ratio','Property Debt to Total Income Ratio');
                $scope.data.push(ratioIdealHouseExpenseMinArr, ratioIdealHouseExpenseMaxArr,ratioHouseExpenseArr);
            }
            //Debt to Income Ratio
            if($scope.check.ratio === 'debtIncome'){
                $scope.series.push('Min Ideal Ratio', 'Max Ideal Ratio','Monthly Debt Servicing to Income Ratio');
                $scope.data.push(ratioIdealDebtIncomeMinArr, ratioIdealDebtIncomeMaxArr,ratioDebtIncomeArr);
            }
            //Consumer Debt Ratio
            if($scope.check.ratio === 'consumerDebt'){
                $scope.series.push('Min Ideal Ratio', 'Max Ideal Ratio','Monthly Credit Card Debt to Income Ratio');
                $scope.data.push(ratioIdealConsumerDebtMinArr, ratioIdealConsumerDebtMaxArr,ratioConsumerDebtArr);
            }

            //5 Net Worth and Other Ratio
            //Net Worth Benchmark
            if($scope.check.ratio === 'netWorthBenchmark'){
                $scope.series.push('Min Ideal Ratio', 'Net Worth Benchmark');
                $scope.data.push(ratioIdealNetWorthBenchmarkMinArr, ratioNetWorthBenchmarkArr);
            }
            //Solvency Ratio
            if($scope.check.ratio === 'solvency'){
                $scope.series.push('Min Ideal Ratio','Solvency Ratio');
                $scope.data.push(ratioIdealSolvencyMinArr, ratioSolvencyArr);
            }

            //6 Asset vs Debt Ratio
            //Current Asset to Debt Ratio
            if($scope.check.ratio === 'currentAssetDebt'){
                $scope.series.push('Min Ideal Ratio', 'Current Asset to Debt Ratio');
                $scope.data.push(ratioIdealCurrentAssetDebtMinArr, ratioCurrentAssetDebtArr);
            }
            //Investment Ratio
            if($scope.check.ratio === 'investment'){
                $scope.series.push('Min Ideal Ratio', 'Investment Assets to Total Assets Ratio');
                $scope.data.push(ratioIdealInvestmentMinArr, ratioInvestmentArr);
            }


            //Add to overview
            $scope.labelsOverview = ratioMthArr;
            $scope.seriesOverview1 = [];
            $scope.dataOverview1 = []; 
            $scope.seriesOverview2 = [];
            $scope.dataOverview2 = [];

            if($scope.checkTotal.assets){
                $scope.seriesOverview1.push('Assets');
                $scope.dataOverview1.push(aRecordsTotalAmtArr);
            }
            if($scope.checkTotal.liabilities){
                $scope.seriesOverview1.push('Liabilities');
                $scope.dataOverview1.push(lRecordsTotalAmtArr);
            }
            if($scope.checkTotal.netWorth){
                $scope.seriesOverview1.push('Net Worth');
                $scope.dataOverview1.push(netWorthTotalAmtArr);
            }
            if($scope.checkTotal.monthlyIncome){
                $scope.seriesOverview2.push('Monthly Income');
                $scope.dataOverview2.push(ieRecordsIncomeArr);
            }
            if($scope.checkTotal.monthlyExpense){
                $scope.seriesOverview2.push('Monthly Expense');
                $scope.dataOverview2.push(ieRecordsExpenseArr);
            }
            if($scope.checkTotal.netGrossIncome){
                $scope.seriesOverview2.push('Net Gross Income');
                $scope.dataOverview2.push(ieRecordsTotalAmtArr);
            }
        };
        
        var retrieveAssetsRecord = function(month, year){
            var displayAssetsRecords;
            if (!$scope.user.assetsRecordsPeriod || ($scope.user.assetsRecordsPeriod.minMonth > month && $scope.user.assetsRecordsPeriod.minYear >= year) || ( $scope.user.assetsRecordsPeriod.minYear > year)) {

                    displayAssetsRecords = AssetsService.assetsRecords;
                    displayAssetsRecords.year = angular.copy(year);
                    displayAssetsRecords.month = angular.copy(month);
                    console.log('No Record?');

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
            if (!$scope.user.liabilitiesRecordsPeriod || ($scope.user.liabilitiesRecordsPeriod.minMonth > month && $scope.user.liabilitiesRecordsPeriod.minYear >= year) || ( $scope.user.liabilitiesRecordsPeriod.minYear > year)) {

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
            if (!$scope.user.incomeExpenseRecordsPeriod || ($scope.user.incomeExpenseRecordsPeriod.minMonth > month && $scope.user.incomeExpenseRecordsPeriod.minYear >= year) || ($scope.user.incomeExpenseRecordsPeriod.minYear > year)) {

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
            var numHealthyRatio = 0;
            var numUnHealthyRatio = 0;
            $scope.homeHealthyRatioArr = [];
            $scope.homeUnHealthyRatioArr = [];

            //Ratio Formula time
            //1) Liquidity Ratio
            //Current Liquidity 
            var ratioLiquidity = angular.copy($scope.displayAssetsRecords.cashEquivalentsAmt) / angular.copy($scope.displayIncomeExpenseRecords.monthlyExpenseAmt);
            //Total Liquidity 
            var ratioTotalLiquidity = (Number($scope.displayAssetsRecords.cashEquivalentsAmt) + Number($scope.displayAssetsRecords.investedAssetsAmt)) / $scope.displayIncomeExpenseRecords.monthlyExpenseAmt;

            //2) Savings
            //Surplus Income Ratio /Savings Ratio //To review -- net gross/ monthly gross income
            var ratioSaving = $scope.displayIncomeExpenseRecords.netCashFlow / $scope.displayIncomeExpenseRecords.monthlyIncomeAmt;
            //Basic Saving Ratio   
            var ratioBasicSaving = $scope.displayIncomeExpenseRecords.optionalSavingsAmt / $scope.displayIncomeExpenseRecords.monthlyIncomeAmt;

            //3) Expenses Ratio
            //Essential Expenses to Income Ratio
            var ratioEssentialExpenses;
            var publicTransportValue;
            try{
                publicTransportValue = $scope.displayIncomeExpenseRecords.monthlyExpense.transport.publicTransport.value;
            }catch(e){
                publicTransportValue = 0;
            }
            var maidValue;

            try{
                maidValue = $scope.displayIncomeExpenseRecords.monthlyExpense.fixedExpense.maid.value;
            }catch(e){
                maidValue = 0;
            }            

            ratioEssentialExpenses = (Number($scope.displayIncomeExpenseRecords.fixedExpenseAmt) + Number(publicTransportValue) + Number($scope.displayIncomeExpenseRecords.utilityHouseholdAmt) + Number($scope.displayIncomeExpenseRecords.foodNecessitiesAmt) - Number(maidValue))/ $scope.displayIncomeExpenseRecords.monthlyIncomeAmt;

            //Lifestyle Expenses to Income Ratio
            var ratioLifestyleExpenses;

            ratioLifestyleExpenses = (Number(maidValue) + Number($scope.displayIncomeExpenseRecords.transportAmt) - Number(publicTransportValue) + Number($scope.displayIncomeExpenseRecords.miscAmt)) / $scope.displayIncomeExpenseRecords.monthlyIncomeAmt;

            //4 Debt Ratio
            //Assets to Debt Ratio
            var ratioAssetDebt = $scope.displayLiabilitiesRecords.totalAmt / $scope.displayAssetsRecords.totalAmt;
            //Debt Service Ratio
            var ratioDebtService = $scope.displayLiabilitiesRecords.shortTermCreditAmt / ($scope.displayIncomeExpenseRecords.monthlyIncomeAmt * 12);
            //Housing Expense Ratio
            var ratioHouseExpense = ($scope.displayIncomeExpenseRecords.monthlyExpenseAmt - $scope.displayIncomeExpenseRecords.fixedExpenseAmt) / $scope.displayIncomeExpenseRecords.monthlyIncomeAmt; 
            //Debt Income Ratio
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

            ratioDebtIncome = (Number(mortgageRepaymentsValue) + Number(rentalRepaymentsValue) + Number(carLoanRepaymentValue) + Number(otherLoanRepaymentsValue)) / $scope.displayIncomeExpenseRecords.monthlyIncomeAmt;
            
            //Consumer Debt Ratio
            var ratioConsumerDebt = $scope.displayLiabilitiesRecords.shortTermCreditAmt / $scope.displayIncomeExpenseRecords.monthlyIncomeAmt;

            //5 Net Worth 
            //Net WorthBenchmark Ratio
            // var ratioNetWorthBenchmark = ($scope.displayAssetsRecords.totalAmt - $scope.displayLiabilitiesRecords.totalAmt) / ($scope.user.age  * $scope.displayIncomeExpenseRecords.monthlyIncomeAmt * 12 / 10);
            var netWorthBenchmark = (Number($scope.user.age) * Number($scope.displayIncomeExpenseRecords.monthlyIncomeAmt))/ 10;
            var ratioNetWorthBenchmark = (Number($scope.displayAssetsRecords.totalAmt) - Number($scope.displayLiabilitiesRecords.totalAmt)) / netWorthBenchmark;
            
            //Solvency Ratio
            var ratioSolvency = ($scope.displayAssetsRecords.totalAmt - $scope.displayLiabilitiesRecords.totalAmt) / $scope.displayAssetsRecords.totalAmt;

            //6 Asset vs Debt
            //Current Asset to Debt Ratio
            var ratioCurrentAssetDebt = $scope.displayAssetsRecords.cashEquivalentsAmt / $scope.displayLiabilitiesRecords.shortTermCreditAmt;

            //Investment Ratio
            var ratioInvestment;
            var privatePropertiesValue;
            try{
                privatePropertiesValue = $scope.displayAssetsRecords.investedAssets.privateProperties.value;
            }catch(e){
                privatePropertiesValue = 0;
            }      
            ratioInvestment = (Number($scope.displayAssetsRecords.cashEquivalentsAmt) + Number($scope.displayAssetsRecords.investedAssetsAmt) - Number(privatePropertiesValue)) / $scope.displayAssetsRecords.totalAmt;    
            // if($scope.displayAssetsRecords.investedAssets && $scope.displayAssetsRecords.investedAssets.privateProperties){
            //     ratioInvestment = ($scope.displayAssetsRecords.cashEquivalentsAmt + $scope.displayAssetsRecords.investedAssetsAmt - $scope.displayAssetsRecords.investedAssets.privateProperties.value) / $scope.displayAssetsRecords.totalAmt;
            // }



            //Assign Ratio to Scope
            //1) Liquidity Ratio
            //Current Liquidity 
            if(isFinite(ratioLiquidity)) {
                $scope.displayOverview.ratioLiquidity = ratioLiquidity.toFixed(2);
            }else {
                $scope.displayOverview.ratioLiquidity = 'N/A';
            }
            //Total Liquidity 
            if(isFinite(ratioTotalLiquidity)){
                $scope.displayOverview.ratioTotalLiquidity = ratioTotalLiquidity.toFixed(2);
            }else{
                $scope.displayOverview.ratioTotalLiquidity = 'N/A';
            }

            //2) Savings
            //Surplus Income Ratio /Savings Ratio
            if(isFinite(ratioSaving)) {
                $scope.displayOverview.ratioSaving = ratioSaving.toFixed(2);
            }else{
                $scope.displayOverview.ratioSaving = 'N/A';
            }
            //Basic Saving Ratio 
            if(isFinite(ratioBasicSaving)){
                $scope.displayOverview.ratioBasicSaving = ratioBasicSaving.toFixed(2);
            }else{
                $scope.displayOverview.ratioBasicSaving = 'N/A';
            }

            //3) Expenses Ratio
            //Essential Expenses to Income Ratio
            if(isFinite(ratioEssentialExpenses)){
                $scope.displayOverview.ratioEssentialExpenses = ratioEssentialExpenses.toFixed(2);
            }else{
                $scope.displayOverview.ratioEssentialExpenses = 'N/A';
            }
            //Lifestyle Expenses to Income Ratio
            if(isFinite(ratioLifestyleExpenses)){
                $scope.displayOverview.ratioLifestyleExpenses = ratioLifestyleExpenses.toFixed(2);
            }else{
                $scope.displayOverview.ratioLifestyleExpenses = 'N/A';
            }


            //4) Debt Ratio
            //Assets to Debt Ratio
            if(isFinite(ratioAssetDebt)) {
                $scope.displayOverview.ratioAssetDebt = ratioAssetDebt.toFixed(2);
            }else {
                $scope.displayOverview.ratioAssetDebt = 'N/A';
            }
            //Debt Service Ratio
            if(isFinite(ratioDebtService)) {
                $scope.displayOverview.ratioDebtService = ratioDebtService.toFixed(2);
            }else {
                $scope.displayOverview.ratioDebtService ='N/A';
            }
            //Housing Expense Ratio
            if(isFinite(ratioHouseExpense)) {
                $scope.displayOverview.ratioHouseExpense = ratioHouseExpense.toFixed(2);
            } else {
                $scope.displayOverview.ratioHouseExpense = 'N/A';
            }
            //Debt Income Ratio
            if(isFinite(ratioDebtIncome)) {
                $scope.displayOverview.ratioDebtIncome = ratioDebtIncome.toFixed(2);
            }else{
                $scope.displayOverview.ratioDebtIncome = 'N/A';
            }
            //Consumer Debt Ratio
            if(isFinite(ratioConsumerDebt)) {
                $scope.displayOverview.ratioConsumerDebt = ratioConsumerDebt.toFixed(2);
            }else{
                $scope.displayOverview.ratioConsumerDebt = 'N/A';
            }
            //5 Net Worth 
            //Net WorthBenchmark Ratio
            if(isFinite(ratioNetWorthBenchmark)) {
                $scope.displayOverview.ratioNetWorthBenchmark = ratioNetWorthBenchmark.toFixed(2);
            } else {
                $scope.displayOverview.ratioNetWorthBenchmark = 'N/A';
            }
            //Solvency Ratio
            if(isFinite(ratioSolvency)) {
                $scope.displayOverview.ratioSolvency = ratioSolvency.toFixed(2);
            }else{
                $scope.displayOverview.ratioSolvency = 'N/A';
            }

            //6 Asset vs Debt
            //Current Asset to Debt Ratio
            if(isFinite(ratioCurrentAssetDebt)){
                $scope.displayOverview.ratioCurrentAssetDebt = ratioCurrentAssetDebt.toFixed(2);
            }else{
                $scope.displayOverview.ratioCurrentAssetDebt = 'N/A';
            }
            //Investment Ratio
            if(isFinite(ratioInvestment)) {
                $scope.displayOverview.ratioInvestment = ratioInvestment.toFixed(2);
            }else{
                $scope.displayOverview.ratioInvestment = 'N/A';
            }

            
            //Set analysis for each ratio
            //1) Liquidity Ratio
            //Current Liquidity 
            if($scope.displayOverview.ratioLiquidity !== 'N/A'){
                if($scope.displayOverview.ratioLiquidity < 2){
                    $scope.displayAnalysis.liquidity = $scope.analysisRatio.analysisLiquidity.unhealthy[0];
                    numUnHealthyRatio++;
                    $scope.homeUnHealthyRatioArr.push('Current Liquidity Ratio');
                    $scope.liquidityHealth = 2;
                }else if ($scope.displayOverview.ratioLiquidity >=2 && $scope.displayOverview.ratioLiquidity < 6){
                    $scope.displayAnalysis.liquidity = $scope.analysisRatio.analysisLiquidity.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Current Liquidity Ratio');
                    $scope.liquidityHealth = 1;
                }else if ($scope.displayOverview.ratioLiquidity >=6){
                    $scope.displayAnalysis.liquidity = $scope.analysisRatio.analysisLiquidity.healthy[1];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Current Liquidity Ratio');
                    $scope.liquidityHealth = 1;
                }
            }else{
                $scope.displayAnalysis.liquidity = 'Unable to generate ratio due to missing inputs';
                $scope.liquidityHealth = 0;
            }
            //Total Liquidity 
            if($scope.displayOverview.ratioTotalLiquidity !== 'N/A'){
                if($scope.displayOverview.ratioTotalLiquidity < 6 ){
                    $scope.displayAnalysis.totalLiquidity = $scope.analysisRatio.analysisTotalLiquidity.unhealthy[0];
                    numUnHealthyRatio++;
                    $scope.homeUnHealthyRatioArr.push('Total Liquidity Ratio');
                    $scope.totalLiquidityHealth = 2;
                }else if($scope.displayOverview.ratioTotalLiquidity >=6){
                    $scope.displayAnalysis.totalLiquidity = $scope.analysisRatio.analysisTotalLiquidity.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Total Liquidity Ratio');
                    $scope.totalLiquidityHealth = 1;
                }
            }else{
                $scope.displayAnalysis.totalLiquidity = 'Unable to generate ratio due to missing inputs';
                $scope.totalLiquidityHealth = 0;
            }

            //2) Savings
            //Surplus Income Ratio /Savings Ratio
            if($scope.displayOverview.ratioSaving !== 'N/A'){
                if($scope.displayOverview.ratioSaving <0.12){
                    $scope.displayAnalysis.saving = $scope.analysisRatio.analysisSaving.unhealthy[0];
                    numUnHealthyRatio++; 
                    $scope.homeUnHealthyRatioArr.push('Surplus Income Ratio');
                    $scope.savingHealth = 2;
                }else if($scope.displayOverview.ratioSaving >=0.12 && $scope.displayOverview.ratioSaving <=0.7){
                    $scope.displayAnalysis.saving = $scope.analysisRatio.analysisSaving.healthy[1];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Surplus Income Ratio');
                    $scope.savingHealth = 1;
                }else if($scope.displayOverview.ratioSaving > 0.7){
                    $scope.displayAnalysis.saving = $scope.analysisRatio.analysisSaving.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Surplus Income Ratio');
                    $scope.savingHealth = 1;
                }
            }else{
                $scope.displayAnalysis.saving = 'Unable to generate ratio due to missing inputs';
                $scope.savingHealth = 0;
            }
            //Basic Saving Ratio 
            if($scope.displayOverview.ratioBasicSaving !== 'N/A'){
                if($scope.displayOverview.ratioBasicSaving < 0.1){
                    $scope.displayAnalysis.basicSaving = $scope.analysisRatio.analysisBasicSaving.unhealthy[0];
                    numUnHealthyRatio++; 
                    $scope.homeUnHealthyRatioArr.push('Basic Saving Ratio');
                    $scope.basicSavingHealth = 2;
                }else if($scope.displayOverview.ratioBasicSaving >= 0.1){
                    $scope.displayAnalysis.basicSaving = $scope.analysisRatio.analysisBasicSaving.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Basic Saving Ratio');
                    $scope.basicSavingHealth = 1;
                }
            }else{
                $scope.displayAnalysis.basicSaving = 'Unable to generate ratio due to missing inputs';
                $scope.basicSavingHealth = 0;
            }

            //3) Expenses Ratio
            //Essential Expenses to Income Ratio
            if($scope.displayOverview.ratioEssentialExpenses !== 'N/A'){
                if($scope.displayOverview.ratioEssentialExpenses >=0.5){
                    $scope.displayAnalysis.essentialExpenses = $scope.analysisRatio.analysisEssentialExpenses.unhealthy[0];
                    numUnHealthyRatio++; 
                    $scope.homeUnHealthyRatioArr.push('Essential Expenses to Income Ratio');
                    $scope.essentialExpensesHealth = 2;
                }else if($scope.displayOverview.ratioEssentialExpenses <0.5){
                    $scope.displayAnalysis.essentialExpenses = $scope.analysisRatio.analysisEssentialExpenses.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Essential Expenses to Income Ratio');
                    $scope.essentialExpensesHealth = 1;
                }
            }else{
                $scope.displayAnalysis.essentialExpenses = 'Unable to generate ratio due to missing inputs';
                $scope.essentialExpensesHealth = 0;
            }
            //Lifestyle Expenses to Income Ratio
            if($scope.displayOverview.ratioLifestyleExpenses !== 'N/A'){
                if($scope.displayOverview.ratioLifestyleExpenses >=0.3){
                    $scope.displayAnalysis.lifestyleExpenses = $scope.analysisRatio.analysisLifestyleExpenses.unhealthy[0];
                    numUnHealthyRatio++; 
                    $scope.homeUnHealthyRatioArr.push('Lifestyle Expenses to Income Ratio');
                    $scope.lifestyleExpensesHealth = 2;
                }else if($scope.displayOverview.ratioLifestyleExpenses <0.3){
                    $scope.displayAnalysis.lifestyleExpenses = $scope.analysisRatio.analysisLifestyleExpenses.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Lifestyle Expenses to Income Ratio');
                    $scope.lifestyleExpensesHealth = 1;
                }
            }else{
                $scope.displayAnalysis.lifestyleExpenses = 'Unable to generate ratio due to missing inputs';
                $scope.lifestyleExpensesHealth = 0;
            }

            //4) Debt Ratio
            //Assets to Debt Ratio
            if($scope.displayOverview.ratioAssetDebt !== 'N/A'){
                if($scope.displayOverview.ratioAssetDebt < 0.4){
                    $scope.displayAnalysis.assetDebt = $scope.analysisRatio.analysisAssetDebt.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Total Debt to Annual Income Ratio');
                    $scope.assetDebtHealth = 1;
                }else if($scope.displayOverview.ratioAssetDebt >=0.4 && $scope.displayOverview.ratioAssetDebt < 0.6){
                    $scope.displayAnalysis.assetDebt = $scope.analysisRatio.analysisAssetDebt.healthy[1];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Total Debt to Annual Income Ratio');
                    $scope.assetDebtHealth = 1;
                }else if($scope.displayOverview.ratioAssetDebt >=0.6){
                    $scope.displayAnalysis.assetDebt = $scope.analysisRatio.analysisAssetDebt.unhealthy[0];
                    numUnHealthyRatio++;
                    $scope.homeUnHealthyRatioArr.push('Total Debt to Annual Income Ratio');
                    $scope.assetDebtHealth = 2;
                }
            }else{
                $scope.displayAnalysis.assetDebt = 'Unable to generate ratio due to missing inputs';
                $scope.assetDebtHealth = 0;
            }
            //Debt Service Ratio
            if($scope.displayOverview.ratioDebtService !== 'N/A'){
                if($scope.displayOverview.ratioDebtService <=0.36){
                    $scope.displayAnalysis.debtService = $scope.analysisRatio.analysisDebtService.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Current Debt to Annual Income Ratio');
                    $scope.debtServiceHealth = 1;
                }else if($scope.displayOverview.ratioDebtService > 0.36){
                    $scope.displayAnalysis.debtService = $scope.analysisRatio.analysisDebtService.unhealthy[0];
                    numUnHealthyRatio++;
                    $scope.homeUnHealthyRatioArr.push('Current Debt to Annual Income Ratio');
                    $scope.debtServiceHealth = 2;
                }
            }else{
                $scope.displayAnalysis.debtService = 'Unable to generate ratio due to missing inputs';
                $scope.debtServiceHealth = 0;
            }
            //Housing Expense Ratio
            if($scope.displayOverview.ratioHouseExpense !== 'N/A'){
                if($scope.displayOverview.ratioHouseExpense <=0.35){
                    $scope.displayAnalysis.houseExpense = $scope.analysisRatio.analysisHouseExpense.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Property Debt to Total Income Ratio');
                    $scope.houseExpenseHealth = 1;
                }else if($scope.displayOverview.ratioHouseExpense > 0.35){
                    $scope.displayAnalysis.houseExpense = $scope.analysisRatio.analysisHouseExpense.unhealthy[0];
                    numUnHealthyRatio++;
                    $scope.homeUnHealthyRatioArr.push('Property Debt to Total Income Ratio');
                    $scope.houseExpenseHealth = 2;
                }
            }else{
                $scope.displayAnalysis.houseExpense = 'Unable to generate ratio due to missing inputs';
                $scope.houseExpenseHealth = 0;
            }
            //Debt Income Ratio
            if($scope.displayOverview.ratioDebtIncome !== 'N/A'){
                if($scope.displayOverview.ratioDebtIncome <=0.4){
                    $scope.displayAnalysis.debtIncome = $scope.analysisRatio.analysisDebtIncome.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Monthly Debt Servicing to Income Ratio');
                    $scope.debtIncomeHealth = 1;
                }else if($scope.displayOverview.ratioDebtIncome > 0.4){
                    $scope.displayAnalysis.debtIncome = $scope.analysisRatio.analysisDebtIncome.unhealthy[0];
                    numUnHealthyRatio++;
                    $scope.homeUnHealthyRatioArr.push('Monthly Debt Servicing to Income Ratio');
                    $scope.debtIncomeHealth = 2;
                }
            }else{
                $scope.displayAnalysis.debtIncome = 'Unable to generate ratio due to missing inputs';
                $scope.debtIncomeHealth = 0;
            }            
            //Consumer Debt Ratio
            if($scope.displayOverview.ratioConsumerDebt !== 'N/A'){
                if($scope.displayOverview.ratioConsumerDebt <=0.1){
                    $scope.displayAnalysis.consumerDebt = $scope.analysisRatio.analysisConsumerDebt.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Monthly Credit Card Debt to Income Ratio');
                    $scope.consumerDebtHealth = 1;
                }else if($scope.displayOverview.ratioConsumerDebt > 0.1){
                    $scope.displayAnalysis.consumerDebt = $scope.analysisRatio.analysisConsumerDebt.unhealthy[0];
                    numUnHealthyRatio++;
                    $scope.homeUnHealthyRatioArr.push('Monthly Credit Card Debt to Income Ratio');
                    $scope.consumerDebtHealth = 2;
                }
            }else{
                $scope.displayAnalysis.consumerDebt = 'Unable to generate ratio due to missing inputs';
                $scope.consumerDebtHealth = 0;
            } 
            //5 Net Worth 
            //Net WorthBenchmark Ratio
            if($scope.displayOverview.ratioNetWorthBenchmark !== 'N/A'){
                if($scope.displayOverview.ratioNetWorthBenchmark <=0.75){
                    $scope.displayAnalysis.netWorthBenchmark = $scope.analysisRatio.analysisNetWorthBenchmark.unhealthy[0];
                    numUnHealthyRatio++;
                    $scope.homeUnHealthyRatioArr.push('Net Worth Benchmark');
                    $scope.netWorthHealth = 2;
                }else if($scope.displayOverview.ratioNetWorthBenchmark >0.75 && $scope.displayOverview.ratioNetWorthBenchmark <=1){
                    $scope.displayAnalysis.netWorthBenchmark = $scope.analysisRatio.analysisNetWorthBenchmark.healthy[1];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Net Worth Benchmark');
                    $scope.netWorthHealth = 1;
                }else if($scope.displayOverview.ratioNetWorthBenchmark > 1){
                    $scope.displayAnalysis.netWorthBenchmark = $scope.analysisRatio.analysisNetWorthBenchmark.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Net Worth Benchmark');
                    $scope.netWorthHealth = 1;
                }
            }else{
                $scope.displayAnalysis.netWorthBenchmark = 'Unable to generate ratio due to missing inputs';
                $scope.netWorthHealth = 0;
            }
            //Solvency Ratio
            if($scope.displayOverview.ratioSolvency !== 'N/A'){
                if($scope.displayOverview.ratioSolvency <=0.2){
                    $scope.displayAnalysis.solvency = $scope.analysisRatio.analysisSolvency.unhealthy[0];
                    numUnHealthyRatio++;
                    $scope.homeUnHealthyRatioArr.push('Solvency Ratio');
                    $scope.solvencyHealth = 2;
                }else if($scope.displayOverview.ratioSolvency > 0.2){
                    $scope.displayAnalysis.solvency = $scope.analysisRatio.analysisSolvency.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Solvency Ratio');
                    $scope.solvencyHealth = 1;
                }
            }else{
                $scope.displayAnalysis.solvency = 'Unable to generate ratio due to missing inputs';
                $scope.solvencyHealth = 0;
            } 
            //6 Asset vs Debt
            //Current Asset to Debt Ratio
            if($scope.displayOverview.ratioCurrentAssetDebt !== 'N/A'){
                if($scope.displayOverview.ratioCurrentAssetDebt <=0.2){
                    $scope.displayAnalysis.currentAssetDebt = $scope.analysisRatio.analysisCurrentAssetDebt.unhealthy[0];
                    numUnHealthyRatio++;
                    $scope.homeUnHealthyRatioArr.push('Current Asset to Debt Ratio');
                    $scope.currentAssetDebtHealth = 2;
                }else if($scope.displayOverview.ratioInvestment > 0.2){
                    $scope.displayAnalysis.currentAssetDebt = $scope.analysisRatio.analysisCurrentAssetDebt.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Current Asset to Debt Ratio');
                    $scope.currentAssetDebtHealth = 1;
                }
            }else{
                $scope.displayAnalysis.currentAssetDebt = 'Unable to generate ratio due to missing inputs';
                $scope.currentAssetDebtHealth = 0;
            } 

            //Investment Ratio
            if($scope.displayOverview.ratioInvestment !== 'N/A'){
                if($scope.displayOverview.ratioInvestment <=0.2){
                    $scope.displayAnalysis.investment = $scope.analysisRatio.analysisInvestment.unhealthy[0];
                    numUnHealthyRatio++;
                    $scope.homeUnHealthyRatioArr.push('Investment Assets to Total Assets Ratio');
                    $scope.investmentHealth = 2;
                }else if($scope.displayOverview.ratioInvestment > 0.2){
                    $scope.displayAnalysis.investment = $scope.analysisRatio.analysisInvestment.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Investment Assets to Total Assets Ratio');
                    $scope.investmentHealth = 1;
                }
            }else{
                $scope.displayAnalysis.investment = 'Unable to generate ratio due to missing inputs';
                $scope.investmentHealth = 0;
            } 

            //Render ratio to home page
            

            $scope.homeHealthDisplay = true;
            $scope.homeHealth = [{value: (numHealthyRatio*100/15), type: 'success'}, {value: (numUnHealthyRatio*100/15), type:'danger'}];
            if($scope.homeHealth[0].value === 0 && $scope.homeHealth[1].value === 0){
                $scope.homeHealth = [{
                    value: 100,
                    type: 'info'
                }];
                $scope.homeHealthDisplay = false;
            }
        };

        var calculateRatiosTable = function(aRecords, lRecords, ieRecords) {
    
            //liquidity 1
            var ratioLiquidity = (aRecords.cashEquivalentsAmt / ieRecords.monthlyExpenseAmt).toFixed(2);
            if (!isFinite(ratioLiquidity)||isNaN(ratioLiquidity)) {
                ratioLiquidity = '-';
            }
            $scope.liquidityRatioTable.push(ratioLiquidity);
            //2
            var ratioTotalLiquidity = ((Number(aRecords.cashEquivalentsAmt) + Number(aRecords.investedAssetsAmt)) / ieRecords.monthlyExpenseAmt).toFixed(2);
            if (!isFinite(ratioTotalLiquidity)||isNaN(ratioTotalLiquidity)) {
                ratioTotalLiquidity = '-';
            }
            $scope.liquidityTotalTable.push(ratioTotalLiquidity);
            
            //saving ratio 1
            var ratioSaving = ($scope.displayIncomeExpenseRecords.netCashFlow / $scope.displayIncomeExpenseRecords.monthlyIncomeAmt).toFixed(2);
            if (!isFinite(ratioSaving)||isNaN(ratioSaving)) {
                ratioSaving = '-';
            }
            $scope.surplusIncomeTable.push(ratioSaving);

            //2
            var ratioBasicSaving = ($scope.displayIncomeExpenseRecords.optionalSavingsAmt / $scope.displayIncomeExpenseRecords.monthlyIncomeAmt).toFixed(2);
            if (!isFinite(ratioBasicSaving)||isNaN(ratioBasicSaving)) {
                ratioBasicSaving = '-';
            }
            $scope.basicSavingTable.push(ratioBasicSaving);

            //Expense Ratio 1 +2
            var ratioEssentialExpenses;
            var publicTransportChartValue;
            try{
                publicTransportChartValue = ieRecords.monthlyExpense.transport.publicTransport.value;
            }catch(e){
                publicTransportChartValue = 0;
            }
            var maidChartValue;
            try{
                maidChartValue = ieRecords.monthlyExpense.fixedExpense.maid.value;
            }catch(e){
                maidChartValue = 0;
            }            
            ratioEssentialExpenses = ((Number(ieRecords.fixedExpenseAmt) + Number(publicTransportChartValue) + Number(ieRecords.utilityHouseholdAmt) + Number(ieRecords.foodNecessitiesAmt) - Number(maidChartValue))/ ieRecords.monthlyIncomeAmt).toFixed(2);
            if (!isFinite(ratioEssentialExpenses)||isNaN(ratioEssentialExpenses)) {
                ratioEssentialExpenses = '-';
            }
            $scope.essentialExpensesTable.push(ratioEssentialExpenses);
            //Lifestyle Expenses to Income Ratio
            var ratioLifestyleExpenses;

            ratioLifestyleExpenses = ((Number(maidChartValue) + Number(ieRecords.transportAmt) - Number(publicTransportChartValue) + Number(ieRecords.miscAmt)) / ieRecords.monthlyIncomeAmt).toFixed(2);
            if (!isFinite(ratioLifestyleExpenses)||isNaN(ratioLifestyleExpenses)) {
                ratioLifestyleExpenses = '-';
            }
            $scope.lifestyleExpensesTable.push(ratioLifestyleExpenses);

            //DEBTT RATIOSSSs
            // 1
            var ratioAssetDebt = (lRecords.totalAmt / aRecords.totalAmt).toFixed(2);
            if (!isFinite(ratioAssetDebt)||isNaN(ratioAssetDebt)) {
                ratioAssetDebt = '-';
            }
            $scope.totalDebtToAnnualIncomeTable.push(ratioAssetDebt);            

            //2
            var ratioDebtService = (lRecords.totalAmt / ieRecords.monthlyIncomeAmt).toFixed(2);
            if (!isFinite(ratioDebtService)||isNaN(ratioDebtService)) {
                ratioDebtService = '-';
            }
            $scope.currentDebtToAnnualIncomeTable.push(ratioDebtService);

            //3
            var ratioHouseExpense = ((ieRecords.monthlyExpenseAmt - ieRecords.fixedExpenseAmt) / ieRecords.monthlyIncomeAmt).toFixed(2); 
            if (!isFinite(ratioHouseExpense)||isNaN(ratioHouseExpense)) {
                ratioHouseExpense = '-';
            }
            $scope.propertyDebtToTotalIncomeTable.push(ratioHouseExpense);

            //4
            var ratioDebtIncome;
            var mortgageRepaymentsValue;
            var rentalRepaymentsValue;
            var carLoanRepaymentValue;
            var otherLoanRepaymentsValue;

            try {
                mortgageRepaymentsValue = ieRecords.monthlyExpense.fixedExpense.mortgageRepayments.value;
            }catch (e){
                mortgageRepaymentsValue = 0;
            }
            try{
                rentalRepaymentsValue = ieRecords.monthlyExpense.fixedExpense.rentalRepaymentsValue.value;
            }catch(e){
                rentalRepaymentsValue = 0;
            }
            try{
                carLoanRepaymentValue = ieRecords.monthlyExpense.transport.carLoanRepayment.value;
            }catch (e) {
                carLoanRepaymentValue = 0;
            }
            try{
                otherLoanRepaymentsValue = ieRecords.monthlyExpense.fixedExpense.otherLoanRepayments.value;
            }catch(e){
                otherLoanRepaymentsValue = 0;
            }
            ratioDebtIncome = ((Number(mortgageRepaymentsValue) + Number(rentalRepaymentsValue) + Number(carLoanRepaymentValue) + Number(otherLoanRepaymentsValue)) / $scope.displayIncomeExpenseRecords.monthlyIncomeAmt).toFixed(2);
            if (!isFinite(ratioDebtIncome)||isNaN(ratioDebtIncome)) {
                ratioDebtIncome = '-';
            }
            $scope.monthlyDebtServicingToIncomeTable.push(ratioDebtIncome);

            //5
            var ratioConsumerDebt = (lRecords.shortTermCreditAmt / ieRecords.monthlyIncomeAmt).toFixed(2);
            if (!isFinite(ratioConsumerDebt)||isNaN(ratioConsumerDebt)) {
                ratioConsumerDebt = '-';
            }
            $scope.monthlyCreditCardToIncomeTable.push(ratioConsumerDebt);

            //Net Worth and other Ratios
            //1
            var netWorthBenchmark = (Number($scope.user.age) * Number(ieRecords.monthlyIncomeAmt))/ 10;
            var ratioNetWorthBenchmark = ((Number(aRecords.totalAmt) - Number(lRecords.totalAmt)) / netWorthBenchmark).toFixed(2);
            if (!isFinite(ratioNetWorthBenchmark)||isNaN(ratioNetWorthBenchmark)) {
                ratioNetWorthBenchmark = '-';
            }
            $scope.netWorthBenchmarkTable.push(ratioNetWorthBenchmark);

            //2
            var ratioSolvency = ((aRecords.totalAmt - lRecords.totalAmt) / aRecords.totalAmt).toFixed(2);
            if (!isFinite(ratioSolvency)||isNaN(ratioSolvency)) {
                ratioSolvency = '-';
            }
            $scope.solvencyTable.push(ratioSolvency);

            //Asset Vs Debt Ratios
            //1
            var ratioCurrentAssetDebt = ($scope.displayAssetsRecords.cashEquivalentsAmt / $scope.displayLiabilitiesRecords.shortTermCreditAmt).toFixed(2);
            if (!isFinite(ratioCurrentAssetDebt)||isNaN(ratioCurrentAssetDebt)) {
                ratioCurrentAssetDebt = '-';
            }
            $scope.assetToDebtTable.push(ratioCurrentAssetDebt);
            //2
            var ratioInvestment;
            var privatePropertiesValue;
            try{
                privatePropertiesValue = aRecords.investedAssets.privateProperties.value;
            }catch(e){
                privatePropertiesValue = 0;
            }      
            ratioInvestment = ((Number(aRecords.cashEquivalentsAmt) + Number(aRecords.investedAssetsAmt) - Number(privatePropertiesValue)) / aRecords.totalAmt).toFixed(2);
            if (!isFinite(ratioInvestment)||isNaN(ratioInvestment)) {
                ratioInvestment = '-';
            }
            $scope.investmentTable.push(ratioInvestment);

        };

        //for chart display
        var calculateRatiosChart = function(aRecords, lRecords, ieRecords, ratioMthNum){
            aRecords = aRecords;
            lRecords = lRecords;
            ieRecords = ieRecords;
            
            //Ratio Formula time
            //---Liquidity---
            //Current Liquidity 
            var ratioLiquidityChart = aRecords.cashEquivalentsAmt / ieRecords.monthlyExpenseAmt;
            //Total Liquidity Ratio
            var ratioTotalLiquidityChart = (Number(aRecords.cashEquivalentsAmt) + Number(aRecords.investedAssetsAmt)) / ieRecords.monthlyExpenseAmt;

            //---Savings---
            //Surplus Income Ratio /Savings Ratio
            var ratioSavingChart = ieRecords.netCashFlow / ieRecords.monthlyIncomeAmt;
            //Basic Saving Ratio            
            var ratioBasicSavingChart = ieRecords.optionalSavingsAmt / ieRecords.monthlyIncomeAmt;  

            //--here continue
            //--- Expenses Ratio
            //Essential Expenses to Income Ratio
            var ratioEssentialExpensesChart;
            var publicTransportChartValue;
            try{
                publicTransportChartValue = ieRecords.monthlyExpense.transport.publicTransport.value;
            }catch(e){
                publicTransportChartValue = 0;
            }
            var maidChartValue;
            try{
                maidChartValue = ieRecords.monthlyExpense.fixedExpense.maid.value;
            }catch(e){
                maidChartValue = 0;
            }            
            ratioEssentialExpensesChart = (Number(ieRecords.fixedExpenseAmt) + Number(publicTransportChartValue) + Number(ieRecords.utilityHouseholdAmt) + Number(ieRecords.foodNecessitiesAmt) - Number(maidChartValue))/ ieRecords.monthlyIncomeAmt;
            //Lifestyle Expenses to Income Ratio
            var ratioLifestyleExpensesChart;

            ratioLifestyleExpensesChart = (Number(maidChartValue) + Number(ieRecords.transportAmt) - Number(publicTransportChartValue) + Number(ieRecords.miscAmt)) / ieRecords.monthlyIncomeAmt;

            //---Debt---
            //AssetDebt Ratio
            var ratioAssetDebtChart = lRecords.totalAmt/ aRecords.totalAmt;
            //Debt Service Ratio // To check short term
            var ratioDebtServiceChart = lRecords.totalAmt / ieRecords.monthlyIncomeAmt;
            //Housing Expense Ratio
            var ratioHouseExpenseChart = (Number(ieRecords.monthlyExpenseAmt) - Number(ieRecords.fixedExpenseAmt)) / ieRecords.monthlyIncomeAmt; 
            //Debt Income Ratio
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
            ratioDebtIncomeChart = (Number(mortgageRepaymentsChartValue) + Number(rentalRepaymentsChartValue) + Number(carLoanRepaymentChartValue) + Number(otherLoanRepaymentsChartValue)) / ieRecords.monthlyIncomeAmt;
            // if(ieRecords.monthlyExpense && ieRecords.monthlyExpense.fixedExpense && ieRecords.monthlyExpense.transport && ieRecords.monthlyExpense.fixedExpense.mortgageRepayments && ieRecords.monthlyExpense.fixedExpense.rentalRepayments && ieRecords.monthlyExpense.transport.carLoanRepayment && ieRecords.monthlyExpense.fixedExpense.otherLoanRepayments){
            //     ratioDebtIncomeChart = (ieRecords.monthlyExpense.fixedExpense.mortgageRepayments.value + ieRecords.monthlyExpense.fixedExpense.rentalRepayments.value + ieRecords.monthlyExpense.transport.carLoanRepayment.value + ieRecords.monthlyExpense.fixedExpense.otherLoanRepayments.value)  /  ieRecords.netCashFlow;
            // }
            //Consumer Debt Ratio
            var ratioConsumerDebtChart = lRecords.shortTermCreditAmt / ieRecords.monthlyIncomeAmt;

            //---Net Worth/ Others---
            //Net Worth Benchmark        
            // var ratioNetWorthBenchmarkChart = (aRecords.totalAmt - lRecords.totalAmt) / ($scope.user.age  * ieRecords.monthlyIncomeAmt * 12 / 10);
            var netWorthBenchmarkChart = ($scope.user.age * ieRecords.monthlyIncomeAmt) / 10;
            var ratioNetWorthBenchmarkChart = (Number(aRecords.totalAmt) - Number(lRecords.totalAmt)) / netWorthBenchmarkChart;
            //Solvency Ratio
            var ratioSolvencyChart = (aRecords.totalAmt - lRecords.totalAmt) / aRecords.totalAmt;

            //---Asset vs Debts
            //Current Asset to Debt Ratio   
            var ratioCurrentAssetDebtChart = aRecords.cashEquivalentsAmt / lRecords.shortTermCreditAmt;
            //Investment Ratio
            var ratioInvestmentChart;
            var privatePropertiesChartValue;
            try{
                privatePropertiesChartValue = aRecords.investedAssets.privateProperties.value;
            }catch(e){
                privatePropertiesChartValue = 0;
            }      
            ratioInvestmentChart = (Number(aRecords.cashEquivalentsAmt) + Number(aRecords.investedAssetsAmt) - Number(privatePropertiesChartValue)) / aRecords.totalAmt; 
            // if(aRecords.investedAssets && aRecords.investedAssets.privateProperties){
            //     ratioDebtIncomeChart = (aRecords.cashEquivalentsAmt + aRecords.investedAssetsAmt - aRecords.investedAssets.privateProperties.value) / aRecords.totalAmt;
            // }
            

            //Assign Ratio to Scope
            //---Liquidity---
            //Current Liquidity 
            if(isFinite(ratioLiquidityChart)) {
                ratioLiquidityArr[ratioMthNum] = Number(ratioLiquidityChart.toFixed(2));
            } else{
                ratioLiquidityArr[ratioMthNum] = 0;
            }
            ratioIdealLiquidityMinArr[ratioMthNum] = 2;
            ratioIdealLiquidityMaxArr[ratioMthNum] = 6;
            //Total Liquidity Ratio
            if(isFinite(ratioTotalLiquidityChart)){
                ratioTotalLiquidityArr[ratioMthNum] = Number(ratioTotalLiquidityChart.toFixed(2));
            }else{
                ratioTotalLiquidityArr[ratioMthNum] = 0;
            }
            ratioIdealTotalLiquidityMinArr[ratioMthNum] = 6;

            //---Savings---
            //Surplus Income Ratio /Savings Ratio
            if(isFinite(ratioSavingChart)) {
                ratioSavingArr[ratioMthNum] = Number(ratioSavingChart.toFixed(2));
            } else{
                ratioSavingArr[ratioMthNum] = 0;
            }
            ratioIdealSavingMinArr[ratioMthNum] = 0.12;
            ratioIdealSavingMaxArr[ratioMthNum] = 0.7;
            //Basic Saving Ratio
            if(isFinite(ratioBasicSavingChart)){
                ratioBasicSavingArr[ratioMthNum] = Number(ratioBasicSavingChart.toFixed(2));
            }else{
                ratioBasicSavingArr[ratioMthNum] = 0;
            }
            ratioIdealBasicSavingMinArr[ratioMthNum] = 0.1;

            //--- Expenses Ratio
            //Essential Expenses to Income Ratio
            if(isFinite(ratioEssentialExpensesChart)){
                ratioEssentialExpensesArr[ratioMthNum] = Number(ratioEssentialExpensesChart.toFixed(2));
            }else{
                ratioEssentialExpensesArr[ratioMthNum] = 0;
            }
            ratioIdealEssentialExpensesMaxArr[ratioMthNum] = 0.5;
            //Lifestyle Expenses to Income Ratio
            if(isFinite(ratioLifestyleExpensesChart)){
                ratioLifestyleExpensesArr[ratioMthNum] = Number(ratioLifestyleExpensesChart.toFixed(2));
            }else{
                ratioLifestyleExpensesArr[ratioMthNum] = 0;
            }
            ratioIdealLifestyleExpensesMaxArr[ratioMthNum] = 0.5;

            //---Debt---
            //AssetDebt Ratio
            if(isFinite(ratioAssetDebtChart)) {
                ratioAssetDebtArr[ratioMthNum] = Number(ratioAssetDebtChart.toFixed(2));
            } else{
                ratioAssetDebtArr[ratioMthNum] = 0; 
            }
            ratioIdealAssetDebtMinArr[ratioMthNum] = 0;
            ratioIdealAssetDebtMaxArr[ratioMthNum] = 0.3;
            //Debt Service Ratio
            if(isFinite(ratioDebtServiceChart)) {
                ratioDebtServiceArr[ratioMthNum] = Number(ratioDebtServiceChart.toFixed(2));
            } else {
                ratioDebtServiceArr[ratioMthNum] = 0;

            }
            ratioIdealDebtServiceMinArr[ratioMthNum] = 0;
            ratioIdealDebtServiceMaxArr[ratioMthNum] = 0.36;            
            //Housing Expense Ratio
            if(isFinite(ratioHouseExpenseChart)) {
                ratioHouseExpenseArr[ratioMthNum] = Number(ratioHouseExpenseChart.toFixed(2));
            } else{
                ratioHouseExpenseArr[ratioMthNum] = 0;
            }
            ratioIdealHouseExpenseMinArr[ratioMthNum] = 0;
            ratioIdealHouseExpenseMaxArr[ratioMthNum] = 0.35;
            //Debt Income Ratio
            if(isFinite(ratioDebtIncomeChart)) {
                ratioDebtIncomeArr[ratioMthNum] = Number(ratioDebtIncomeChart.toFixed(2));
            } else {
                ratioDebtIncomeArr[ratioMthNum] = 0;
            }
            ratioIdealDebtIncomeMinArr[ratioMthNum] = 0;
            ratioIdealDebtIncomeMaxArr[ratioMthNum] = 0.4;
            //Consumer Debt Ratio
            if(isFinite(ratioConsumerDebtChart)) {
                ratioConsumerDebtArr[ratioMthNum] = Number(ratioConsumerDebtChart.toFixed(2));
            }else {
                ratioConsumerDebtArr[ratioMthNum] = 0;
            }
            ratioIdealConsumerDebtMinArr[ratioMthNum] = 0;
            ratioIdealConsumerDebtMaxArr[ratioMthNum] = 0.1;   

            //---Net Worth/ Others---
            //Net Worth Benchmark    
            if(isFinite(ratioNetWorthBenchmarkChart)) {
                ratioNetWorthBenchmarkArr[ratioMthNum] = Number(ratioNetWorthBenchmarkChart.toFixed(2));
            }else {
                ratioNetWorthBenchmarkArr[ratioMthNum] = 0;    
            }
            ratioIdealNetWorthBenchmarkMinArr[ratioMthNum] = 0.75;
            //Solvency Ratio
            if(isFinite(ratioSolvencyChart)) {
                ratioSolvencyArr[ratioMthNum] = Number(ratioSolvencyChart.toFixed(2));
            } else {
                ratioSolvencyArr[ratioMthNum] = 0;   
            }
            ratioIdealSolvencyMinArr[ratioMthNum] = 0.2;

            //---Asset vs Debts
            //Current Asset to Debt Ratio  
            if(isFinite(ratioCurrentAssetDebtChart)) {
                ratioCurrentAssetDebtArr[ratioMthNum] = Number(ratioCurrentAssetDebtChart.toFixed(2));
            } else{
                ratioCurrentAssetDebtArr[ratioMthNum] = 0;           
            }
            ratioIdealCurrentAssetDebtMinArr[ratioMthNum] = 0.1;            
            //Investment Ratio
            if(isFinite(ratioInvestmentChart)) {
                ratioInvestmentArr[ratioMthNum] = Number(ratioInvestmentChart.toFixed(2));
            } else{
                ratioInvestmentArr[ratioMthNum] = 0;           
            }
            ratioIdealInvestmentMinArr[ratioMthNum] = 0.2;

        };

		$scope.reportOptions = function(){
			$scope.selectedMonthReport = $rootScope.selectedMonthReport;
			$scope.selectedYearReport = $rootScope.selectedYearReport;
			$scope.selectedReportOption = $rootScope.selectedReportOption;

			if($scope.selectedReportOption === '0'){
				$scope.periodNum = 3;
			}else if($scope.selectedReportOption === '1'){
				$scope.periodNum = 6;
			}else if($scope.selectedReportOption === '2'){
				$scope.periodNum = 12;
			}
			retrieveLatestRecords();
            updateChart();

               
            $timeout(function() {
                $window.print();
            }, 1500);
		};
        $scope.print = function(){

        	// generateReportFn();
        	// $scope.ReportGenerationService.state = {month: 1};
        	// $scope.ReportGenerationService.update({
        	// 	month: 1
        	// });
        	// console.log($scope.ReportGenerationService);
        	$rootScope.selectedMonthReport = $scope.selectedMonthReport;
        	$rootScope.selectedYearReport = $scope.selectedYearReport;
        	$rootScope.selectedReportOption = $scope.selectedReportOption;
        	retrieveLatestRecords();
            updateChart();
            

        	$window.location.href = ('/#!/financial/pdf');

        };


	}
]);