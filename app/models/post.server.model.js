'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Article Schema
 */
var PostSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	title: {
		type: String,
		default: '',
		trim: true,
		required: 'Title cannot be blank'
	},
	content: {
		type: String,
		default: '',
		trim: true
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	privacy:{
		type:String,
		default: 'public'
	},
	upVote:{
		type:Array
	},
	downVote:{
		type:Array
	},
	comments: [({
		userId: {
			type: Schema.ObjectId,
			ref: 'user'
		}, 
		comment: {
			type: String
		},
		created: {
			type: Date,
			default: Date.now
		}		
	})]
});

mongoose.model('Post', PostSchema);
