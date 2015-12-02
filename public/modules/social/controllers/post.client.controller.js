'use strict';

// Articles controller
angular.module('social').controller('PostsController', ['$scope', '$stateParams','$state', '$location','$window', 'Authentication', '$http', 'Post','$anchorScroll', '$q', '$timeout',
	function($scope, $stateParams,$state, $location,$window, Authentication, $http, Post,$anchorScroll,$q, $timeout) {
		$scope.user = Authentication.user;
		if (!$scope.user) $location.path('/');

		$scope.postFilter = 'public';
		$scope.imageUrl = 'https://hexapic.s3.amazonaws.com/';

		$scope.changeColor = function(menu, bool) {
		    if(bool === true) {
		        $scope.menuColor = {'background-color': '#B8A631', 'color': 'white'};
		    } else if (bool === false) {
		        $scope.menuColor = {'background-color': 'white', 'color':'black'}; //or, whatever the original color is
		    }
		};

		$scope.newPost = function(){
			$location.path('/posts/create');
			// $scope.post.privacy = 'public';
		};

		$scope.createPost = function () {
	    	// Create new Article object
	    	var post = new Post({
		    	title: this.title,
		        content: this.content,
		        privacy: this.privacy
		    });
			$http.post('/api/posts', post).success(function(response){
		        // $location.path('/post/' + response._id);
		  		$window.location.reload();
		        $location.path('/social/posts');
		        // Clear form fields
		        $scope.title = '';
		        $scope.content = '';
			}).error(function(){
				console.log('Problem with posting');
			});	
	    };
		$scope.editPost = function () {
			var postURL = '/api/posts/' + $stateParams.postId;
			var viewPostURL = '/post/' + $stateParams.postId;
	    	// Create new Article object
	    	var post = new Post({
		    	title: $scope.post.title,
		        content: $scope.post.content,
		        privacy: $scope.post.privacy
		    });
			$http.put(postURL, post).success(function(response){
		        // $location.path('/post/' + response._id);
		        $location.path(viewPostURL);

		        // Clear form fields
		        $scope.title = '';
		        $scope.content = '';
			}).error(function(response){
				console.log(response);
			});	
	    };

	    $scope.remove = function() {
			var postURL = '/api/posts/' + $stateParams.postId;
			$http.delete(postURL).then(function(response){
				$location.path('/social/posts');
				$scope.post = response.data;
			});	
	    };

	    $scope.findOne = function(){
			var userURL = '/api/posts/' + $stateParams.postId;
			$http.get(userURL).then(function(response){
				$scope.post = response.data;
			});	
	    };


	    $scope.findPostsPublic = function () {
	    	$anchorScroll();
	    	$scope.posts = Post.query();
	    };
	    $scope.findPostsFriends = function () {
	    	$anchorScroll();
			$http.get('/api/postsByFriends').then(function(response){
				$scope.posts = response.data;
			});  	
	    };
	    $scope.findPostsPersonal = function () {
	    	$anchorScroll();
			$http.get('/api/postsByMe').then(function(response){
				$scope.posts = response.data;
			});
	    };

	    $scope.addComment = function(){
	    	$http.put('/api/commentPost', {postId: $stateParams.postId, comment: $scope.comment}).success(function(response){
	    		$scope.post = response;
	    		// $window.location.reload();
	    		$scope.comment = '';
	    	}).error(function(){
	    		console.log('There is an error adding comments');
	    	});
	    };

	    $scope.editComment = function(commentContent, comment) {
	    	$scope.editCmt = !$scope.editCmt;
	    	$http.put('/api/editComment', {postId: $stateParams.postId, comment: commentContent, commentId : comment._id}).success(function(response){
	    		$scope.post = response;
	    		// $window.location.reload();
	    	}).error(function(){
	    		console.log('There is an error editing comments');
	    	});    	
	    };
	    $scope.removeComment = function(comment){
	    	$http.put('/api/removeComment', {postId: $stateParams.postId, commentId: comment._id}).success(function(response){
	    		$scope.post = response;
	    	}).error(function(){
	    		console.log('There is an error deleting comment');
	    	});
	    };

	    $scope.upPost = function(postId){

			$http.put('/api/upPoints', {postId: postId, postFilter: $scope.postFilter}).success(function(response){
	  			$scope.posts = response;

	  		}).error(function(){
	  			console.log('There is an error upvoting');
	  		});	    	

			// var checkUpVoted = function(post){
			// 	var uidFound = false;
			//     var deferred = $q.defer();
			//     $timeout(function() {
	  //   			post.upVote.forEach(function(uId){
	  //   				if($scope.user._id === uId){
	  //   					uidFound = true;
		 //    				$http.put('/api/downPost', {postId: postId, postFilter: $scope.postFilter}).success(function(response){
			// 		  			$scope.posts = response;

			// 		  		}).error(function(){
			// 		  			console.log('There is an error upvoting');
			// 		  		});
	  //   				}
	  //   			});					    	
			//       deferred.resolve(uidFound);
			//     }, 500);

			// 	return deferred.promise;
			// };	    	
			
	  //   	$scope.posts.forEach(function(post){
	  //   		if(post._id === postId){

			// 		checkUpVoted(post).then(function(uidFound){
			// 			console.log(uidFound);
		 //    			if(uidFound === false){
		 //    				$http.put('/api/upPost', {postId: postId, postFilter: $scope.postFilter}).success(function(response){
			// 		  			$scope.posts = response;
			// 		  		}).error(function(){
			// 		  			console.log('There is an error upvoting');
			// 		  		});
		 //    			}
			// 		});

	  //   		}
	  //   	});
	    };

	    $scope.upOnePost = function(postId){
			$http.put('/api/upOnePoints', {postId: postId, postFilter: $scope.postFilter}).success(function(response){
	  			$scope.post = response;

	  		}).error(function(){
	  			console.log('There is an error upvoting');
	  		});	
			// var uidFound = false;
			// $scope.post.upVote.forEach(function(uId){
			// 	if($scope.user._id === uId){
			// 		uidFound = true;
   //  				$http.put('/api/downOnePost', {postId: postId, postFilter: $scope.postFilter}).success(function(response){
			//   			$scope.post = response;
			//   		}).error(function(){
			//   			console.log('There is an error upvoting');
			//   		});
			// 	}
			// });
			// if(uidFound === false){
			// 	$http.put('/api/upOnePost', {postId: postId, postFilter: $scope.postFilter}).success(function(response){
		 //  			$scope.post = response;
		 //  		}).error(function(){
		 //  			console.log('There is an error upvoting');
		 //  		});
			// }
	    };

	}
]);