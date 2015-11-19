'use strict';

angular.module('admin').controller('AdminController', ['$scope', '$http', '$location', 'Authentication', '$window', '$state', 
	function($scope, $http, $location, Authentication, $window, $state) {
		$scope.user = Authentication.user;

		// If user is signed in then redirect back home
		
		if (!$scope.user) {
			$location.path('/');
		}else{
			var userType = $scope.user.roles;
			if (userType[0].localeCompare('admin') !== 0) $location.path('/');
		}


		$scope.emailSelected = null;

		$scope.goToDB =function(){
            $window.open('https://mongolab.com/databases/fyphexa');
		};

		$scope.goToAWS = function(){
			$window.open('https://console.aws.amazon.com/s3/home?bucket=hexapic&prefix=assets%2F&region=us-west-2#');
		};

		$scope.retrieveUserRecordsInit = function(){
			$scope.success = $scope.error = null;
			$scope.successRetrieve = null;
			$http.get('/admin/retrieveUsers').then(function(response){
				$scope.userList = response.data;
				$scope.emailSelected = null;
				$scope.userRecord = null;
			});			
		};
		$scope.retrieveUserRecords = function(){
			$scope.success = $scope.error = null;
			$scope.successRetrieve = null;
			$http.get('/admin/retrieveUsers').then(function(response){
				$scope.userList = response.data;
				$scope.emailSelected = null;
				$scope.userRecord = null;
				$scope.successRetrieve = true;
			});
		};

		$scope.showRecord = function(email){
			$scope.successRetrieve = false;
			$scope.emailSelected = email;
			$scope.userList.forEach(function(user){
				if(user.email === email){
					$scope.userRecord = angular.toJson(user, true);
				}
			});
		};

		$scope.updateRecord = function(){
			$http.put('/admin/updateUser', {userEmail: $scope.emailSelected, userRecord: $scope.userRecord}).success(function(response){
				$http.get('/admin/retrieveUsers').then(function(response){
					$scope.userList = response.data;
				});
				$scope.userRecord = angular.toJson(response, true);
				$scope.success = true;
			}).error(function(response){
				console.log(response.data.message);
				$scope.error = response.data.message;
			});
		};

		$scope.deleteRecord = function(){
			console.log($scope.emailSelected);
			if(!$scope.emailSelected){
				console.log('lol');
				$scope.errorDelete = 'User not selected';
			}else{
				$http.put('/admin/deleteUser', {userEmail: $scope.emailSelected, userRecord: $scope.userRecord}).success(function(response){
					console.log(response);
					$scope.userList = response;
					$scope.successDelete = true;
					$scope.userRecord = null;
					$scope.emailSelected = null;
					
				}).error(function(response){
					$scope.errorDelete = response.data.message;
				});				
			}

		};
		$scope.checkDelete = function(){
			$scope.successDelete = null;
			$scope.errorDelete = null;
			if(!$scope.emailSelected){
				$scope.errorDelete = 'User not selected';
			}
		};

		$scope.createNewUser = function(){
			$http.post('/admin/createUser', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				console.log(response);
				$scope.userList = response;
				$scope.successCreate = true;
			}).error(function(response) {
				$scope.errorCreate = response.message;
			});			
		};

		// Upload functions
		$scope.decachedImageUrl = 'https://hexapic.s3.amazonaws.com/assets/default'+ '?decache=' + Math.random();
      
		var upload_file = function(file, signed_request, url){
			$http.put(signed_request, file).success(function(response) {

				$scope.uploaded = true;
				var newImage = url + '?decache=' + Math.random();
				$http.get(newImage).then(function(response){
					$scope.decachedImageUrl = newImage;
				}, function(response){

				});
				
			}).error(function(response) {
				alert('Could not upload file.'); 
			});

		};
		/*
		    Function to get the temporary signed request from the app.
		    If request successful, continue to upload the file using this signed
		    request.
		*/

	    var upload = function (file) {

			// var str = angular.copy(file.name).split('.');
			// $scope.assetName = str[0];
			$scope.assetName = $scope.assetDetails.name;
			$scope.assetType = file.type;			

		    $http.put('/signawsAdmin', {'assetName': $scope.assetName, 'assetType': $scope.assetType}).success(function(response) {
				// If successful 
				upload_file(file, response.signed_request, response.url);
			}).error(function(response) {
				alert('Could not get signed URL.');
			});
	    };

	    $scope.addNewAsset = function(file){
	    	upload(file);
	    	console.log($scope.assetDetails.name);
	    	$scope.assetDetails.image = $scope.assetDetails.name;
	    	$http.post('/admin/addNewAsset', $scope.assetDetails).success(function(response) {
				// If successful we assign the response to the global user model
				console.log(response);
				$scope.assets = response;
				$scope.successAddAsset = true;
				$scope.successUpdateRecords = $scope.errorUpdateRecords = null;
				$scope.successRetrieveAssets = null;
				$http.get('/admin/retrieveAssets').then(function(response){
					$scope.assetList = response.data;
					$scope.assetSelected = null;
					$scope.assetRecord = null;
					$scope.assetDetails = null;
				});
			}).error(function(response) {
				$scope.errorAddAsset = response.message;
			});	

	    };


	    $scope.retrieveAssetRecordsInit = function(){
			$scope.successUpdateRecords = $scope.errorUpdateRecords = null;
			$scope.successRetrieveAssets = null;
			$http.get('/admin/retrieveAssets').then(function(response){
				$scope.assetList = response.data;
				$scope.assetSelected = null;
				$scope.assetRecord = null;
			});	
	    };

	    $scope.retrieveAssetRecords = function(){
			$scope.successUpdateRecords = $scope.errorUpdateRecords = null;
			$scope.successRetrieveAssets = null;
			$scope.assetRecordShow = false;
			$http.get('/admin/retrieveAssets').then(function(response){
				$scope.assetList = response.data;
				$scope.assetSelected = null;
				$scope.assetRecord = null;
				$scope.successRetrieveAssets = true;
			});		    	
	    };

		$scope.showAssetRecord = function(assetName){
			$scope.assetRecordShow = true;
			$scope.successUpdateAssets = $scope.successAssetDelete = $scope.errorAssetDelete = null;
			var imageUrl = 'https://hexapic.s3.amazonaws.com/assets/';
			$scope.assetImageUrl = imageUrl + assetName + '?decache=' + Math.random();

			$scope.successRetrieveAssets = false;
			$scope.assetSelected = assetName;
			$scope.assetList.forEach(function(asset){
				if(asset.name === assetName){
					$scope.assetRecord = asset;
				}
			});
		};

		$scope.updateAssetRecord = function(){
			$http.put('/admin/updateAsset', {assetName: $scope.assetSelected, assetRecord: $scope.assetRecord}).success(function(response){
				$http.get('/admin/retrieveAssets').then(function(response){
					$scope.assetList = response.data;
				});
				$scope.assetRecord = response;
				$scope.successUpdateAssets = true;
			}).error(function(response){
				console.log(response.data.message);
				$scope.errorUpdateAssets = response.data.message;
			});
		};

		$scope.deleteAssetRecord = function(){
			$http.put('/admin/deleteAsset', {assetName: $scope.assetSelected, assetRecord: $scope.assetRecord}).success(function(response){
				console.log(response);
				$scope.assetList = response;
				$scope.successAssetDelete = true;
				$scope.assetRecord = null;
				$scope.assetSelected = null;
				$scope.assetRecordShow = false;
				// $scope.assetRecordShow = false;
				
			}).error(function(response){
				$scope.errorAssetDelete = response.data.message;
			});	
		};


		//Statistic functions
		//1 Demographcis Credit Profile
		$scope.demographicsOption = [
		'Age of Users',
		'Education Level',
		'Current Employment',
		'Highest Value of House Owned'
		];

		$scope.demographicsOptionFinancial = [
		'Average Monthly Net Income',
		'Average Monthly Net Expenditure',
		'Average Monthly Savings',
		'History of Credit Defaults',
		'Bankruptcy in past 6 years',
		'No. of Credit Cards owned'
		];

		var retrieveUserDemographics = function(){
			$http.get('/admin/retrieveStatisticsCreditProfile').then(function(response){
				$scope.userDemographicsData = response.data;
				$scope.labelsUsers = ['Completed', 'Incomplete'];
  				$scope.dataUsers = [$scope.userDemographicsData.numCompletedCreditProfile, $scope.userDemographicsData.numIncompleteCreditProfile];
  				$scope.totalNumUsers = $scope.userDemographicsData.totalUsers;
  				$scope.usersComplete = $scope.userDemographicsData.numCompletedCreditProfile;
  				$scope.usersIncomplete = $scope.userDemographicsData.numIncompleteCreditProfile;

				$scope.labels = ['20-30', '31-40', '41-50', '51-60', '> 60'];
				$scope.series = ['User age'];
				$scope.data = [$scope.userDemographicsData.ageArr];

				$scope.labelsFinancial = ['> $10,000', '$8,000 - $10,000', '$6,000 - $8,000', '$4,000 - $6,000', '$1,000 - $4,000', '< $1,000', 'NA'];
				$scope.seriesFinancial = ['Average Monthly Net Income'];
				$scope.dataFinancial = [$scope.userDemographicsData.avgIncomeArr];				
				
			});
		};
		retrieveUserDemographics();

		$scope.$watch('selectedDemographicsOption', function(){
			if($scope.selectedDemographicsOption === $scope.demographicsOption[0]){
				$scope.labels = ['20-30', '31-40', '41-50', '51-60', '> 60'];
				$scope.series = ['User Age'];
				if($scope.userDemographicsData){
					$scope.data = [$scope.userDemographicsData.ageArr];
				}
			}else if($scope.selectedDemographicsOption === $scope.demographicsOption[1]){
				$scope.labels = ['PhD', 'Masters', 'Graduate', 'Undergraduate', 'A/O/N Levels', 'PSLE & Below'];
				$scope.series = ['User Education Level'];
				if($scope.userDemographicsData){
					$scope.data = [$scope.userDemographicsData.educationLevelArr];
				}
			}else if($scope.selectedDemographicsOption === $scope.demographicsOption[2]){
				$scope.labels = ['Salaried Employee', 'Businessman/Self-employed', 'Student', 'Unemployed'];
				$scope.series = ['User Current Employment'];
				if($scope.userDemographicsData){
					$scope.data = [$scope.userDemographicsData.currentEmploymentArr];
				}
			}else if($scope.selectedDemographicsOption === $scope.demographicsOption[3]){
				$scope.labels = ['Landed Property', 'Condo/ Private Apartments', 'HDB Executive Flats/ HUDC Flats/ Studio Apartments', 'HDB (Others)', 'Shop houses/ other housing units', 'N/A'];
				$scope.series = ['User Highest Value of House Owned'];
				if($scope.userDemographicsData){
					$scope.data = [$scope.userDemographicsData.housingOwnedArr];
				}
			}
		});

		$scope.$watch('selectedDemographicsOptionFinancial', function(){
			if($scope.selectedDemographicsOptionFinancial === $scope.demographicsOptionFinancial[0]){
				$scope.labelsFinancial = ['> $10,000', '$8,000 - $10,000', '$6,000 - $8,000', '$4,000 - $6,000', '$1,000 - $4,000', '< $1,000', 'NA'];
				$scope.seriesFinancial = ['Average Monthly Net Income'];
				if($scope.userDemographicsData){
					$scope.dataFinancial = [$scope.userDemographicsData.avgIncomeArr];
				}
			}else if($scope.selectedDemographicsOptionFinancial === $scope.demographicsOptionFinancial[1]){
				$scope.labelsFinancial = ['> $10,000', '$8,000 - $10,000', '$6,000 - $8,000', '$4,000 - $6,000', '$1,000 - $4,000', '< $1,000', 'NA'];
				$scope.seriesFinancial = ['Average Monthly Net Expenditure'];
				if($scope.userDemographicsData){
					$scope.dataFinancial = [$scope.userDemographicsData.avgExpenseArr];
				}
			}else if($scope.selectedDemographicsOptionFinancial === $scope.demographicsOptionFinancial[2]){
				$scope.labelsFinancial = ['> $10,000', '$8,000 - $10,000', '$6,000 - $8,000', '$4,000 - $6,000', '$1,000 - $4,000', '< $1,000', 'NA'];
				$scope.seriesFinancial = ['Average Monthly Net Savings'];
				if($scope.userDemographicsData){
					$scope.dataFinancial = [$scope.userDemographicsData.avgSavingsArr];
				}
			}else if($scope.selectedDemographicsOptionFinancial === $scope.demographicsOptionFinancial[3]){
				$scope.labelsFinancial = ['90 days default', '60 days default', '30 days default', 'NA'];
				$scope.seriesFinancial = ['History of Credit Defaults'];
				if($scope.userDemographicsData){
					$scope.dataFinancial = [$scope.userDemographicsData.creditHistoryArr];
				}
			}else if($scope.selectedDemographicsOptionFinancial === $scope.demographicsOptionFinancial[4]){
				$scope.labelsFinancial = ['Yes', 'No'];
				$scope.seriesFinancial = ['Bankruptcy in past 6 years'];
				if($scope.userDemographicsData){
					$scope.dataFinancial = [$scope.userDemographicsData.bankruptStatusArr];
				}
			}else if($scope.selectedDemographicsOptionFinancial === $scope.demographicsOptionFinancial[5]){
				$scope.labelsFinancial = ['5 or more', '3 - 4', '2', '1', '0'];
				$scope.seriesFinancial = ['No. of Credit Cards owned'];
				if($scope.userDemographicsData){
					$scope.dataFinancial = [$scope.userDemographicsData.numCreditCardArr];
				}
			}
		});
		//End 1

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
        var initiateCurrentDate = function(){
	        $scope.dt = new Date();
	        $scope.month = $scope.dt.getMonth();
	        $scope.year = Number($scope.dt.getFullYear());    
	        $scope.selectedYearTo = $scope.year;

	        $scope.monthFrom = $scope.month - 2;
	        $scope.selectedYearFrom = $scope.year;  
	        if($scope.monthFrom < 0){
	        	$scope.monthFrom = 12 + $scope.month - 2;
	        	$scope.selectedYearFrom = $scope.year;
	        }

	        $scope.selectedMonth = $scope.dt.getMonth();
	        $scope.selectedYear = Number($scope.dt.getFullYear());
	        
	          	
        };
        initiateCurrentDate();


		//2 Demographics Financial Health
		$scope.optionFinancialHealth = [
			'Current Liquidity',
			'Total Liquidity',
			'Surplus Income',
			'Basic Saving',
			'Essential Expenses to Income',
			'Lifestyle Expenses to Income',
			'Total Debt to Annual Income',
			'Current Debt to Annual Income',
			'Property Debt to Total Income',
			'Monthly Debt Servicing to Income',
			'Monthly Credit Card Debt to Income',
			'Net Worth Benchmark',
			'Solvency',
			'Current Asset to Debt',
			'Investment Assets to Total Assets'
		];
		var displayFinancialHealth = function(){
			if($scope.selectedOptionFinancialHealth === $scope.optionFinancialHealth[0]){
				if($scope.userFinancialHealth){
					$scope.dataFinancialHealth = [$scope.userFinancialHealth.currentLiquidityArr];
				}	
			}else if($scope.selectedOptionFinancialHealth === $scope.optionFinancialHealth[1]){
				$scope.dataFinancialHealth = [$scope.userFinancialHealth.totalLiquidityArr];				
			}else if($scope.selectedOptionFinancialHealth === $scope.optionFinancialHealth[2]){
				$scope.dataFinancialHealth = [$scope.userFinancialHealth.surplusIncomeArr];				
			}else if($scope.selectedOptionFinancialHealth === $scope.optionFinancialHealth[3]){
				$scope.dataFinancialHealth = [$scope.userFinancialHealth.basicSavingArr];				
			}else if($scope.selectedOptionFinancialHealth === $scope.optionFinancialHealth[4]){
				$scope.dataFinancialHealth = [$scope.userFinancialHealth.essentialExpensesArr];				
			}else if($scope.selectedOptionFinancialHealth === $scope.optionFinancialHealth[5]){
				$scope.dataFinancialHealth = [$scope.userFinancialHealth.lifestyleExpensesArr];				
			}else if($scope.selectedOptionFinancialHealth === $scope.optionFinancialHealth[6]){
				$scope.dataFinancialHealth = [$scope.userFinancialHealth.totalDebtArr];				
			}else if($scope.selectedOptionFinancialHealth === $scope.optionFinancialHealth[7]){
				$scope.dataFinancialHealth = [$scope.userFinancialHealth.currentDebtArr];				
			}else if($scope.selectedOptionFinancialHealth === $scope.optionFinancialHealth[8]){
				$scope.dataFinancialHealth = [$scope.userFinancialHealth.propertyDebtArr];				
			}else if($scope.selectedOptionFinancialHealth === $scope.optionFinancialHealth[9]){
				$scope.dataFinancialHealth = [$scope.userFinancialHealth.monthlyDebtServiceArr];				
			}else if($scope.selectedOptionFinancialHealth === $scope.optionFinancialHealth[10]){
				$scope.dataFinancialHealth = [$scope.userFinancialHealth.monthlyCreditCardArr];				
			}else if($scope.selectedOptionFinancialHealth === $scope.optionFinancialHealth[11]){
				$scope.dataFinancialHealth = [$scope.userFinancialHealth.netWorthBenchmarkArr];				
			}else if($scope.selectedOptionFinancialHealth === $scope.optionFinancialHealth[12]){
				$scope.dataFinancialHealth = [$scope.userFinancialHealth.solvencyArr];				
			}else if($scope.selectedOptionFinancialHealth === $scope.optionFinancialHealth[13]){
				$scope.dataFinancialHealth = [$scope.userFinancialHealth.currentAssetDebtArr];				
			}else if($scope.selectedOptionFinancialHealth === $scope.optionFinancialHealth[14]){
				$scope.dataFinancialHealth = [$scope.userFinancialHealth.investmentAssetsArr];				
			}
		};
		var retrieveFinancialHealth = function(){
			$http.put('/admin/retrieveFinancialHealth', {month:$scope.month, year: $scope.selectedYear}).success(function(response){
				$scope.userFinancialHealth = response;
				console.log($scope.userFinancialHealth);
				
				$scope.labelsFinancialHealth = ['Healthy', 'Unhealthy', 'N/A'];
				displayFinancialHealth();
			
			}).error(function(response){
				console.log(response);
			});
		};
		retrieveFinancialHealth();

		$scope.reloadFinancialHealth = function(){
			for(var i = 0; i < $scope.monthArr.length; i++){
				if($scope.monthArr[i] === $scope.selectedMonth){
					$scope.month = i;
				}
			}
			retrieveFinancialHealth();
		};

		$scope.$watch('selectedOptionFinancialHealth', function(){
			displayFinancialHealth();
		});

		//3 Demographics Financial Usage
		var retrieveFinancialUsage = function(){
			var numMonths = 0;
			var mthStart;
			var selectedMonthArr = [];
			if($scope.selectedYearFrom === $scope.selectedYearTo){
				numMonths = $scope.month - $scope.monthFrom + 1;
				mthStart = $scope.monthFrom;
				while(mthStart <= $scope.month){
					selectedMonthArr.push([mthStart, $scope.selectedYearFrom]);
					mthStart++;
				}
				
			}else {
				try{
					numMonths += 11 - $scope.monthFrom + 1;
					mthStart = $scope.monthFrom;
					while(mthStart < 12){
						selectedMonthArr.push([mthStart, $scope.selectedYearFrom]);
						mthStart++;
					}					
					$scope.selectedYearFrom += 1;
					while($scope.selectedYearFrom !== $scope.selectedYearTo){
						numMonths += 12;
						for(var i = 0; i < 12; i++){
							selectedMonthArr.push([i, $scope.selectedYearFrom]);
						}						
						$scope.selectedYearFrom ++;
					}
					numMonths += $scope.month + 1;
					mthStart = 0;
					while(mthStart <= $scope.month){
						selectedMonthArr.push([mthStart, $scope.selectedYearFrom]);
						mthStart++;
					}	
				}catch(err){
					console.log(err);
				}
			}
			$http.put('/admin/retrieveFinancialUsage', {monthFrom: $scope.monthFrom, yearFrom: $scope.selectedYearFrom, monthTo: $scope.month, yearTo: $scope.selectedYearTo, numMonths:numMonths, selectedMonthArr: selectedMonthArr}).success(function(response){
				$scope.userFinancialUsageData = response;
				

				selectedMonthArr.forEach(function(monthYearArr){
					monthYearArr[0] = $scope.monthArr[monthYearArr[0]];
				});
				$scope.labelsFinancialUsage = selectedMonthArr;
				$scope.seriesFinancialUsage = ['Updated Assets', 'Updated Liabilities', 'Updated Income'];
				$scope.dataFinancialUsage = [$scope.userFinancialUsageData.assetsArr, $scope.userFinancialUsageData.liabilitiesArr, $scope.userFinancialUsageData.incomeExpenseArr];
			
				
			}).error(function(response){
				console.log(response);
			});
		};
		retrieveFinancialUsage();

		$scope.reloadFinancialUsage = function(){
			console.log('reload');
			var yearFrom = angular.copy($scope.selectedYearFrom);
			for(var i = 0; i < $scope.monthArr.length; i++){
				if($scope.monthArr[i] === $scope.selectedMonthFrom){
					$scope.monthFrom = i;
				}
				if($scope.monthArr[i] === $scope.selectedMonthTo){
					$scope.month = i;
				}
			}
			retrieveFinancialUsage();
			$scope.selectedYearFrom = yearFrom;
		};
		//4 Demographcis Milestones Completion
		var retrieveMilestones = function(){
			$http.get('/admin/retrieveMilestones').then(function(response){
				$scope.userMilestonesData = response.data;

				$scope.labelsMilestones = ['Total', 'Completed'];
				$scope.seriesMilestones = ['Milestones Overview'];
				$scope.dataMilestones = [$scope.userMilestonesData.milestonesArr];	
				
			});
		};
		retrieveMilestones();

		//5 Demographics Social Activity 
		var retrieveSocialActivity = function(){
			var numMonths = 0;
			var mthStart;
			var selectedMonthArr = [];
			if($scope.selectedYearFrom === $scope.selectedYearTo){
				numMonths = $scope.month - $scope.monthFrom + 1;
				mthStart = $scope.monthFrom;
				while(mthStart <= $scope.month){
					selectedMonthArr.push([mthStart, $scope.selectedYearFrom]);
					mthStart++;
				}
				
			}else {
				try{
					numMonths += 11 - $scope.monthFrom + 1;
					mthStart = $scope.monthFrom;
					while(mthStart < 12){
						selectedMonthArr.push([mthStart, $scope.selectedYearFrom]);
						mthStart++;
					}					
					$scope.selectedYearFrom += 1;
					while($scope.selectedYearFrom !== $scope.selectedYearTo){
						numMonths += 12;
						for(var i = 0; i < 12; i++){
							selectedMonthArr.push([i, $scope.selectedYearFrom]);
						}						
						$scope.selectedYearFrom ++;
					}
					numMonths += $scope.month + 1;
					mthStart = 0;
					while(mthStart <= $scope.month){
						selectedMonthArr.push([mthStart, $scope.selectedYearFrom]);
						mthStart++;
					}	
				}catch(err){
					console.log(err);
				}
			}
			$http.put('/admin/retrieveSocialActivity', {monthFrom: $scope.monthFrom, yearFrom: $scope.selectedYearFrom, monthTo: $scope.month, yearTo: $scope.selectedYearTo, numMonths:numMonths, selectedMonthArr: selectedMonthArr}).success(function(response){
				$scope.userSocialActivityData = response;
				

				selectedMonthArr.forEach(function(monthYearArr){
					monthYearArr[0] = $scope.monthArr[monthYearArr[0]];
				});
				$scope.labelsSocialActivity = selectedMonthArr;
				$scope.seriesSocialActivity = ['Posts Created', 'Comments Created'];
				$scope.dataSocialActivity = [$scope.userSocialActivityData.postsArr, $scope.userSocialActivityData.commentsArr];
			
				
			}).error(function(response){
				console.log(response);
			});
		};
		retrieveSocialActivity();

		$scope.reloadSocialActivity = function(){
			console.log('reload');
			var yearFrom = angular.copy($scope.selectedYearFrom);
			for(var i = 0; i < $scope.monthArr.length; i++){
				if($scope.monthArr[i] === $scope.selectedMonthFrom){
					$scope.monthFrom = i;
				}
				if($scope.monthArr[i] === $scope.selectedMonthTo){
					$scope.month = i;
				}
			}
			retrieveSocialActivity();
			$scope.selectedYearFrom = yearFrom;
		};
	}
]);