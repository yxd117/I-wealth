'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Article Schema
 */
var AssetSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	name: {
		type: String,
		default: '',
		trim: true,
		required: 'Title cannot be blank'
	},
	description: {
		type: String,
		default: '',
		trim: true
	},
	image: {
		type: String,
		required: 'Image need to be attached'
	},
	display:{
		type:Boolean,
		default:false
	},
	startDate:{
		type:Date
	},
	endDate:{
		type:Date
	}

});

mongoose.model('Asset', AssetSchema);
