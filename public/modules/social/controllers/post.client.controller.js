'use strict';

// Articles controller
angular.module('social').controller('PostsController', ['$scope', '$stateParams','$state', '$location','$window', 'Authentication', '$http', 'Post','$anchorScroll',
	function($scope, $stateParams,$state, $location,$window, Authentication, $http, Post,$anchorScroll) {
		$scope.user = Authentication.user;
		if (!$scope.user) $location.path('/');

		$scope.postFilter = 'public';
		$scope.imageUrl = 'https://hexapic.s3.amazonaws.com/';

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
		        $location.path('/socialPost');
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
			console.log($scope.post.content);
	    	// Create new Article object
	    	var post = new Post({
		    	title: $scope.post.title,
		        content: $scope.post.content,
		        privacy: $scope.post.privacy
		    });

			$http.put(postURL, post).success(function(response){
		        // $location.path('/post/' + response._id);
		        $location.path(viewPostURL);
		      	console.log(response);

		        // Clear form fields
		        $scope.title = '';
		        $scope.content = '';
			}).error(function(){
				console.log('Problem with posting');
			});	
	    };

	    $scope.remove = function() {
			var postURL = '/api/posts/' + $stateParams.postId;
			$http.delete(postURL).then(function(response){
				$location.path('/socialPost');
				$scope.post = response.data;
			});	
	    };

	    $scope.findOne = function(){
			var userURL = '/api/posts/' + $stateParams.postId;
			$http.get(userURL).then(function(response){
				console.log(response.data.user._id);
				console.log($scope.user._id);
				$scope.post = response.data;
				console.log($scope.post.title);
			});	
	    };

	    $scope.findPostsPublic = function () {
	    	$anchorScroll();
	    	$scope.posts = Post.query();
	    };
	    $scope.findPostsFriends = function () {
	    	$anchorScroll();
			$http.get('/api/postsByFriends').then(function(response){
				console.log(response);
				$scope.posts = response.data;
			});  	
	    };
	    $scope.findPostsPersonal = function () {
	    	$anchorScroll();
			$http.get('/api/postsByMe').then(function(response){
				console.log(response);
				$scope.posts = response.data;
			});
	    };

	    $scope.addComment = function(){
	    	console.log($scope.comment);
	    	console.log($stateParams.postId);
	    	$http.put('/api/commentPost', {postId: $stateParams.postId, comment: $scope.comment}).success(function(response){
	    		console.log(response);
	    		$scope.post = response;
	    		// $window.location.reload();
	    		$scope.comment = '';
	    	}).error(function(){
	    		console.log('There is an error adding comments');
	    	});
	    };

	    $scope.editComment = function(commentContent, comment) {
	    	console.log('here');
	    	console.log(commentContent);
	    	console.log($stateParams.postId);
	    	console.log(comment);
	    	$scope.editCmt = !$scope.editCmt;
	    	$http.put('/api/editComment', {postId: $stateParams.postId, comment: commentContent, commentId : comment._id}).success(function(response){
	    		console.log(response);
	    		$scope.post = response;
	    		// $window.location.reload();
	    	}).error(function(){
	    		console.log('There is an error editing comments');
	    	});    	
	    };
	    $scope.removeComment = function(comment){
	    	console.log(comment);
	    	$http.put('/api/removeComment', {postId: $stateParams.postId, commentId: comment._id}).success(function(response){
	    		console.log(response);
	    		$scope.post = response;
	    	}).error(function(){
	    		console.log('There is an error deleting comment');
	    	});
	    };
	}
]);