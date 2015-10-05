'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Notification Schema
 */
var NotificationSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	title: {
		type: String,
		default: 'Notification',
		trim: true
	},
	content: {
		type: String,
		default: '',
		trim: true
	},
	userList: [({
		userId: {
			type: Schema.ObjectId,
			ref: 'user'
		}, 
		viewed: {
			type: Boolean,
			default: false
		}	
	})]
});

mongoose.model('Notification', NotificationSchema);