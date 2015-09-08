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

	// Finish by binding the article middleware
	app.param('postId', posts.postByID);
};