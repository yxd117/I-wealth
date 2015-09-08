'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	friendship = require('../../app/controllers/friendship.server.controller');

module.exports = function(app) {
	// Article Routes
	app.route('/friendship/addFriend').put(friendship.addFriend);

	app.route('/friendship/acceptFriend').put(friendship.acceptFriend);

	app.route('/friendship/retrieveUsers').get(friendship.retrieveUserList);
	app.route('/friendship/retrieveFriends').get(friendship.retrieveFriendsList);
	// Finish by binding the friendship middleware
	// app.param('friendshipID', friendship.friendshipByID);

	app.route('/api/social/:profileId').get(users.viewProfile);
	app.param('profileId', users.viewProfileByEmail);
};
