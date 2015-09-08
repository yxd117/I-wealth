'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * friendship Schema
 */
var FriendshipSchema = new Schema({
	created:{
		type: Date,
		default: Date.now
	},
	userEmail: {
		type: String,
		ref: 'User'
	},
	friendEmail:{
		type: String,
		ref: 'User'
	},
	//0- pending
	//1- confirm
	status: {
		type: Number
	}
});


mongoose.model('Friendship', FriendshipSchema);