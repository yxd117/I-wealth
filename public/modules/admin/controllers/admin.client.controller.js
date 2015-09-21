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
				// $scope.assetRecordShow = false;
				
			}).error(function(response){
				$scope.errorAssetDelete = response.data.message;
			});	
		};
	}
]);