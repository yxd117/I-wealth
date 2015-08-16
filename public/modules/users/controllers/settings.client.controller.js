'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http','$state','$timeout' ,'$location', 'Users', 'Authentication', 'Upload',
	function($scope, $http, $state, $timeout,$location, Users, Authentication, Upload) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		var originalUserData = angular.copy(Authentication.user);

		$scope.decachedImageUrl = '/img/default_avatar.jpg';
		if($scope.user.profilePic){
			var imageUrl = 'https://nodeup.s3.amazonaws.com/' + Authentication.user.profilePic;
			$scope.decachedImageUrl = imageUrl + '?decache=' + Math.random();
		}
		$scope.stuff ='';
		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.reset = function(){
			$scope.success = $scope.error = null;
			$scope.user = Authentication.user;
		};

		$scope.cancel = function(){
			// $location.path('/settings/profile');
			$scope.user = originalUserData;
			$scope.submitted = false;
		};

		// Update a user profile
		$scope.updateUserProfilePersonal = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				$scope.user.updatedProfileSettings = true;

				var birthYear = $scope.user.dateOfBirth.getFullYear();
				var birthMonth = $scope.user.dateOfBirth.getMonth();
				var birthDate = $scope.user.dateOfBirth.getDate();
				var currDate = new Date();
				var currYear = currDate.getFullYear();
				var currMonth = currDate.getMonth();
				var currDay = currDate.getDate();
				if(birthMonth < currMonth || birthMonth === currMonth && birthDate <= currDay){
					$scope.user.age = currYear -birthYear;
				}else {
					$scope.user.age = currYear - birthYear - 1;
				}
				if($scope.user.gender === 'Male'){
					$scope.user.sGender = 1;
				} else {
					$scope.user.sGender = 0;
				}
				var user = new Users($scope.user);
				
				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
					$scope.user = Authentication.user;
				}, function(response) {
					$scope.error = response.data.message;
				});
				console.log(user);
			} else {
				$scope.submitted = true;
			}
		};

		$scope.updateUserProfileWork = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				$scope.user.updatedProfileSettings = true;

				var user = new Users($scope.user);
				
				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
					$scope.user = Authentication.user;
				}, function(response) {
					$scope.error = response.data.message;
				});
				console.log(user);
			} else {
				$scope.submitted = true;
			}
		};

		$scope.updateUserProfilePrivacy = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				$scope.user.updatedProfileSettings = true;

				var user = new Users($scope.user);
				
				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
					$scope.user = Authentication.user;
				}, function(response) {
					$scope.error = response.data.message;
				});
				console.log(user);
			} else {
				$scope.submitted = true;
			}
		};
		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Upload functions
      
		var upload_file = function(file, signed_request, url){

			$http.put(signed_request, file).success(function(response) {
				// If successful 
				// $scope.imgUrl = '';
				// $timeout(function(){
				
				// // 	// $state.transitionTo($state.current, $stateParams, {
				// // 	//     reload: true,
				// // 	//     inherit: false,
				// // 	//     notify: true
				// // 	// });
				// $scope.imgUrl = url; 
				// $state.go($state.current, {}, {reload: true});
				// },10000);
				$scope.decachedImageUrl = url + '?decache=' + Math.random();
				$state.go($state.current, {}, {reload: true});
				//$route.reload();     
		        //document.getElementById("avatar_url").value = url;
			}).error(function(response) {
				alert('Could not upload file.'); 
			});

		};

		/*
		    Function to get the temporary signed request from the app.
		    If request successful, continue to upload the file using this signed
		    request.
		*/

		var get_signed_request = function(file){
		    //var xhr = new XMLHttpRequest();
		    var url = 'https://nodeup.s3.amazonaws.com/sign_s3?file_name='+$scope.user.profilePic+'&file_type='+file.type;
		    console.log(file);
		    $http.get('/signaws', file).success(function(response) {
				// If successful 
				//var resp = JSON.parse(response);
				upload_file(file, response.signed_request, response.url);
			}).error(function(response) {
				alert('Could not get signed URL.');
			});
		};

		var appendPic = function(file){
			// $scope.user.profilePic = file.name;
			var str = angular.copy($scope.user.email).split('@');
			$scope.user.profilePic = str[0];
			$scope.user.profilePicType = file.type;
			var user = new Users($scope.user);
			
			user.$update(function(response) {
				Authentication.user = response;
				get_signed_request(file);
			}, function(response) {
				$scope.error = response.data.message;
			});
			console.log(user);
		};

	    $scope.upload = function (file) {
	    	appendPic(file);  
	    };

	    $scope.ngGridFix = function() {
    		window.dispatchEvent(new Event('resize'));
		};

	}
]);