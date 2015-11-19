'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	posts = require('../../app/controllers/posts.server.controller');

module.exports = function(app) {
	// Article Routes
	app.route('/api/posts')
		.get(posts.listAll)
		.post(users.requiresLogin, posts.create);

	app.route('/api/postsByFriends')
		.get(posts.listFriends);

	app.route('/api/postsByMe')
		.get(posts.listPersonal);

	app.route('/api/postsByUser')
		.get(posts.listUserPosts);

	app.route('/api/posts/:postId')
		.get(posts.read)
		.put(users.requiresLogin, posts.hasAuthorization, posts.update)
		.delete(users.requiresLogin, posts.hasAuthorization, posts.delete);

	app.route('/api/commentPost')
		.put(posts.comment);

	app.route('/api/editComment')
		.put(posts.editComment);

	app.route('/api/removeComment')
		.put(posts.removeComment);

	//Post Lists
	// app.route('/api/upPost')
	// 	.put(posts.upPost);
	// app.route('/api/downPost')
	// 	.put(posts.downPost);
	//NEW
	app.route('/api/upPoints')
		.put(posts.upPoints);

	//View One Post
	// app.route('/api/upOnePost')
	// 	.put(posts.upOnePost);
	// app.route('/api/downOnePost')
	// 	.put(posts.downOnePost);
	//NEW
	app.route('/api/upOnePoints')
		.put(posts.upOnePoints);

	//View Profile Posts 
	// app.route('/api/upUserPosts')
	// 	.put(posts.upUserPosts);
	// app.route('/api/downUserPosts')
	// 	.put(posts.downUserPosts);

	app.route('/api/upUserPoints')
		.put(posts.upUserPoints);


	// Finish by binding the article middleware
	app.param('postId', posts.postByID);
};
