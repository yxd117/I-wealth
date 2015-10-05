'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Notification = mongoose.model('Notification'),
	User = mongoose.model('User'),
	_ = require('lodash');

var monthArr = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
            ];

exports.notifyUpdateBudget = function(){
	var month = new Date();
	console.log(monthArr[month.getMonth()]);

	var newNotification = new Notification({
		title: 'Weekly Reminder',
		content: 'Update your budget records!'
	});
	var userArr = [];
	User.find().exec(function(err, users){
		users.forEach(function(user){
			userArr.push({
				userId: user._id,
				viewed: false
			});
		});
		newNotification.userList = userArr;
		console.log(newNotification);

		newNotification.save(function(err){
			if(err){
				console.log(err);
			}else{
				console.log('Success: Create new Notification budget Info');
			}
		});
	});
};

exports.notifyUpdateFinancialInfo = function(){
	var month = new Date();
	console.log(monthArr[month.getMonth()]);

	var newNotification = new Notification({
		title: 'Monthly Reminder',
		content: 'Update your Financial records!'
	});
	var userArr = [];
	User.find().exec(function(err, users){
		users.forEach(function(user){
			userArr.push({
				userId: user._id,
				viewed: false
			});
		});
		newNotification.userList = userArr;
		console.log(newNotification);

		newNotification.save(function(err){
			if(err){
				console.log(err);
			}else{
				console.log('Success: Create new Notification budget Info');
			}
		});
	});
};

exports.viewedNotification = function(req, res){
	// Notification.update()
	console.log(req.user._id);

	req.body.notificationListNew.forEach(function(notification){
		Notification.find({'_id': notification.id}).exec(function(err, notifications){
			notifications.forEach(function(notification){
				notification.userList.forEach(function(user){
					if(user.userId.equals(req.user._id)){
						console.log('ok');
						user.viewed = true;
						notification.save(function(err){
							if(err){
								console.log(err);
							} else{
								console.log('notification updated');
							}

						});
					}
				});
			});
		});
	});
	res.json('success');
};

exports.retrieveAll = function(req, res){
	
	if(req.user){
		Notification.find({'userList.userId': req.user._id}).exec(function(err, notifications){
			var notificationListAll = [];
			var notificationListNew = [];
			notifications.forEach(function(notification){
				notification.userList.forEach(function(user){
					if(user.userId.equals(req.user._id)){
						
						if(user.viewed === false){
							notificationListNew.push({
								id: notification._id,
								title: notification.title,
								content: notification.content
							});
						}
					}
				});
				notificationListAll.push({
					id: notification._id,
					title: notification.title,
					content: notification.content,
					date: notification.created
				});
			});
			res.json({
				notificationListAll: notificationListAll,
				notificationListNew: notificationListNew
			});

		});		
	}


};