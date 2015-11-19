'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	notification = require('../../app/controllers/notification.server.controller');

module.exports = function(app) {
	// Article Routes
	app.route('/notification/retrieveAll').get(notification.retrieveAll);

	app.route('/notification/viewedNotification').put(notification.viewedNotification);


};