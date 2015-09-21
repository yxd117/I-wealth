'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	friendship = require('../../app/controllers/friendship.server.controller'),
	admin = require('../../app/controllers/admin.server.controller');

module.exports = function(app) {
	// Article Routes
	app.route('/admin/retrieveUsers').get(admin.retrieveUserList);

	app.route('/admin/updateUser').put(admin.updateUser);

	app.route('/admin/deleteUser').put(admin.deleteUser);

	app.route('/admin/createUser').post(admin.createUser);

	app.route('/signawsAdmin').put(admin.signaws);

	app.route('/admin/addNewAsset').post(admin.addNewAsset);

	app.route('/admin/retrieveAssets').get(admin.retrieveAssets);

	app.route('/admin/updateAsset').put(admin.updateAsset);

	app.route('/admin/deleteAsset').put(admin.deleteAsset);

	// app.route('/friendship/acceptFriend').put(friendship.acceptFriend);

	// app.route('/friendship/retrieveUsers').get(friendship.retrieveUserList);
	// app.route('/friendship/retrieveFriends').get(friendship.retrieveFriendsList);
	// // Finish by binding the friendship middleware
	// // app.param('friendshipID', friendship.friendshipByID);

	// app.route('/api/social/:profileId').get(users.viewProfile);
	// app.param('profileId', users.viewProfileByEmail);
};