'use strict';

// Setting up route
angular.module('social').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('viewProfile', {
			url: '/social/:profileId',
			templateUrl: 'modules/social/views/view-profile.client.view.html'
		}).
     //  	state('posts', {
	    //     abstract: true,
	    //     url: '/posts',
	    //     template: '<ui-view/>'
	    // }).
	    // state('postslist', {
	    //     url: '',
	    //     templateUrl: 'modules/social/views/list-post.client.view.html'
	    // }).
	    state('postView', {
	    	url: '/post/:postId',
	        templateUrl: 'modules/social/views/view-post.client.view.html'
	    }).
	    state('postEdit', {
	    	url: '/post/:postId/edit',
	        templateUrl: 'modules/social/views/edit-post.client.view.html'
	    }).
	    state('postsCreate', {
	        url: '/posts/create',
	        templateUrl: 'modules/social/views/create-post.client.view.html'
	       //  data: {
	       //    roles: ['user', 'admin']
	      	// }
      	});
	}
]);