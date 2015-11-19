'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash'),
	errorHandler = require('../app/controllers/errors.server.controller'),
	mongoose = require('mongoose'),
	config = require('./config'),
	nodemailer = require('nodemailer'),
	async = require('async'),
	crypto = require('crypto'),
	glob = require('glob'),
	fs = require('fs'),
	schedule = require('node-schedule'),
	User = mongoose.model('User'),
	Notification = mongoose.model('Notification'),
	NotifyCtrl = require('../app/controllers/notification.server.controller');

module.exports = function() {

	var rule = new schedule.RecurrenceRule();
	// rule.dayOfWeek = [0,1,2,3,4,5,6];
	rule.dayOfWeek = [1];
	rule.hour = 8;
	rule.minute = 0;

	schedule.scheduleJob(rule, function(){
		//Weekly notification
	    console.log('Weekly Notification!');
	    NotifyCtrl.notifyUpdateBudget();
	});

	schedule.scheduleJob('0 0 9 1 1 *', function(){
		//Monthly notification
    	console.log('Jan: Monthly Notification!');
    	NotifyCtrl.notifyUpdateFinancialInfo();
	});
	schedule.scheduleJob('0 0 9 1 2 *', function(){
		//Monthly notification
    	console.log('Feb: Monthly Notification!');
    	NotifyCtrl.notifyUpdateFinancialInfo();
	});
	schedule.scheduleJob('0 0 9 1 3 *', function(){
		//Monthly notification
    	console.log('Mar: Monthly Notification!');
    	NotifyCtrl.notifyUpdateFinancialInfo();
	});
	schedule.scheduleJob('0 0 9 1 4 *', function(){
		//Monthly notification
    	console.log('Apr: Monthly Notification!');
    	NotifyCtrl.notifyUpdateFinancialInfo();
	});
	schedule.scheduleJob('0 0 9 1 5 *', function(){
		//Monthly notification
    	console.log('May: Monthly Notification!');
    	NotifyCtrl.notifyUpdateFinancialInfo();
	});
	schedule.scheduleJob('0 0 9 1 6 *', function(){
		//Monthly notification
    	console.log('Jun: Monthly Notification!');
    	NotifyCtrl.notifyUpdateFinancialInfo();
	});
	schedule.scheduleJob('0 0 9 1 7 *', function(){
		//Monthly notification
    	console.log('Jul: Monthly Notification!');
    	NotifyCtrl.notifyUpdateFinancialInfo();
	});
	schedule.scheduleJob('0 0 9 1 8 *', function(){
		//Monthly notification
    	console.log('Aug: Monthly Notification!');
    	NotifyCtrl.notifyUpdateFinancialInfo();
	});
	schedule.scheduleJob('0 0 9 1 9 *', function(){
		//Monthly notification
    	console.log('Sep: Monthly Notification!');
    	NotifyCtrl.notifyUpdateFinancialInfo();
	});
	schedule.scheduleJob('0 0 9 1 10 *', function(){
		//Monthly notification
    	console.log('Oct: Monthly Notification!');
    	NotifyCtrl.notifyUpdateFinancialInfo();
	});
	schedule.scheduleJob('0 0 9 1 11 *', function(){
		//Monthly notification
    	console.log('Nov: Monthly Notification!');
    	NotifyCtrl.notifyUpdateFinancialInfo();
	});
	schedule.scheduleJob('0 0 9 1 12 *', function(){
		//Monthly notification
    	console.log('Dec: Monthly Notification!');
    	NotifyCtrl.notifyUpdateFinancialInfo();
	});
};