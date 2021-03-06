'use strict';

// Articles controller
angular.module('social').controller('SocialController', ['$scope', '$window','$stateParams','$state', '$location', 'Authentication', '$http', 'UserProfile', '$anchorScroll', 
	function($scope,$window, $stateParams, $state, $location, Authentication, $http, UserProfile, $anchorScroll) {
		$scope.user = Authentication.user;
		if (!$scope.user) $location.path('/');

		$scope.userList = [];
		$scope.friendList = [];
		$scope.sentFriendReqList = [];
		$scope.pendingReqList = [];

		$scope.imageUrl = 'https://hexapic.s3.amazonaws.com/';
		$scope.yearJoined = new Date($scope.user.created).getFullYear();

		var socialRankUrl = 'https://hexapic.s3.amazonaws.com/' + Authentication.user.socialRankPic;
		var profilePicUrl = 'https://hexapic.s3.amazonaws.com/' + Authentication.user.profilePic;

		$scope.decachedSocialRankUrl = socialRankUrl + '?decache=' + Math.random();		
		$scope.decachedProfilePicUrl = profilePicUrl + '?decache=' + Math.random();

		$scope.refreshSocialRankPic = function(){
				$scope.decachedSocialRankUrl = socialRankUrl + '?decache=' + Math.random();
		};
		if(!$scope.user.age){
			$scope.profileAge = 'N/A';
		} else{
			$scope.profileAge = $scope.user.age;
		}
		if(!$scope.user.description){
			$scope.profileDescription = 'N/A';
		} else{
			$scope.profileDescription = $scope.user.description;
		}
		$scope.numFriends = 0;
		if($scope.user.friendList){
			$scope.user.friendList.forEach(function(friend){
				if(friend.friendStatus === 3) $scope.numFriends++;
			});			
		}

		$scope.findAll = function(){
			$http.get('/friendship/retrieveUsers').then(function(response){
				$scope.userList = response.data;
			});
		};
		$scope.findFriends = function(){
			$http.get('/friendship/retrieveFriends').then(function(response){
				var listOfUsers = response.data;
				listOfUsers.forEach(function(user){
					if(user.friendStatus === 3){
						$scope.friendList.push(user);
					}else if (user.friendStatus === 2){
						$scope.pendingReqList.push(user);
					}else if(user.friendStatus === 1){
						$scope.sentFriendReqList.push(user);
					}
				});
			});
		};
		$scope.addFriend = function(friendEmail, friendId){
			$http.put('/friendship/addFriend', {friendEmail: friendEmail, friendId: friendId}).success(function(response){
				$scope.userList.forEach(function(user){
					if(user.email === friendEmail) user.friendStatus = 1;
				});
				if($scope.userProfile){
					$scope.userProfile.friendStatus = 1;
				}
			}).error(function(){
				console.log('error adding friends');
			});
		};

		$scope.acceptFriend = function(friendEmail, friendId){
			$http.put('/friendship/acceptFriend', {friendEmail: friendEmail, friendId: friendId}).success(function(response){
				$scope.userList.forEach(function(user){
					if(user.email === friendEmail) user.friendStatus = 3;
				});
				$window.location.reload();
			}).error(function(){
				console.log('error adding friends');
			});	
		};
		$scope.findOne = function(){
			var userURL = '/api/social/' + $stateParams.profileId;
			$http.get(userURL).then(function(response){
				$scope.userProfile = response.data;

				$scope.userProfile.friendList.num = 0;
				$scope.userProfile.friendList.forEach(function(friend){
					if(friend.friendStatus === 3){
						$scope.userProfile.friendList.num = $scope.userProfile.friendList.num + 1;
					}
				});
				findProfilePosts($scope.userProfile);
			});			
		};

		var findProfilePosts = function(userProfile){
	    	$anchorScroll();
			$http.get('/api/postsByUser', {params: {_id: userProfile._id}}).then(function(response){
				$scope.posts = response.data;

			});		
	    };

	    $scope.changeColor = function(menu, bool) {
		    if(bool === true) {
		        $scope.menuColor = {'background-color': '#B8A631', 'color': 'white'};
		    } else if (bool === false) {
		        $scope.menuColor = {'background-color': 'white', 'color':'black'}; //or, whatever the original color is
		    }
		};

	    $scope.upPost = function(postId, userProfile){
			$http.put('/api/upUserPoints', {_id: userProfile._id,postId: postId}).success(function(response){
	  			$scope.posts = response;
	  		}).error(function(){
	  			console.log('There is an error upvoting');
	  		});
	    	// $scope.posts.forEach(function(post){
	    	// 	if(post._id === postId){
	    	// 		console.log(post.upVote);
	    	// 		var uidFound = false;
	    	// 		post.upVote.forEach(function(uId){
	    	// 			if($scope.user._id === uId){
	    	// 				uidFound = true;
		    // 				$http.put('/api/downUserPosts', {_id: userProfile._id, postId: postId}).success(function(response){
					 //  			$scope.posts = response;
					 //  			console.log(response);
					 //  		}).error(function(){
					 //  			console.log('There is an error upvoting');
					 //  		});
	    	// 			}
	    	// 		});
	    	// 		if(uidFound === false){
	    	// 			$http.put('/api/upUserPosts', {_id: userProfile._id,postId: postId}).success(function(response){
				  // 			$scope.posts = response;
				  // 		}).error(function(){
				  // 			console.log('There is an error upvoting');
				  // 		});
	    	// 		}
	    	// 	}
	    	// });
	    };

	    

	}
]);