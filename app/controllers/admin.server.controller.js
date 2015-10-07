'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Post = mongoose.model('Post'),
	User = mongoose.model('User'),
	Asset = mongoose.model('Asset'),
	_ = require('lodash'),
	aws = require('aws-sdk');

var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
var S3_BUCKET = process.env.S3_BUCKET;


exports.retrieveUserList = function(req, res){
	User.find({}, function(err, users){
		 res.json(users);
	});
};

exports.updateUser = function(req, res){
	var nUser = JSON.parse(req.body.userRecord);
	User.findOneAndUpdate({'email': req.body.userEmail}, {$set : nUser}, function(err, user){
		if(err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}else{
			res.json(user);			
		}

	});
};

exports.deleteUser = function(req, res){
	console.log(req.body.userRecord);
	// User.find({'email': req.body.userEmail}).remove().exec();
	User.remove({'email': req.body.userEmail}, function(err){
		if(err){
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}else{
			User.find({}, function(err, users){
				res.json(users);
			});
		}
	});
};

exports.createUser = function(req, res){
	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;
	console.log('create user function server');
	// Init Variables
	var user = new User(req.body);
	var message = null;

	// Add missing user fields
	user.provider = 'local';
	//user.displayName = user.firstName + ' ' + user.lastName;
	user.displayName = user.email;
	user.username = user.email;

	// Then save the user
	user.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			// Remove sensitive data before login
			user.password = undefined;
			user.salt = undefined;
			User.find({}, function(err, users){
				 res.json(users);
			});
		}
	});	
};

exports.signaws = function(req, res){
	console.log(req.body.assetName);
    aws.config.update({accessKeyId: AWS_ACCESS_KEY , secretAccessKey: AWS_SECRET_KEY });
    aws.config.update({region: 'ap-southeast-1' , signatureVersion: 'v4' });
    var s3 = new aws.S3(); 
    var s3_params = { 
        Bucket: S3_BUCKET, 
        Key: 'assets/' + req.body.assetName, 
        Expires: 60, 
        ContentType: req.body.assetType, 
        ACL: 'public-read'
    }; 
    s3.getSignedUrl('putObject', s3_params, function(err, data){ 
        if(err){ 
            console.log(err); 
        }
        else{ 
        	console.log(data);
            var return_data = {
                signed_request: data,
                url: 'https://'+S3_BUCKET+'.s3.amazonaws.com/assets/'+req.body.assetName
            };
            res.write(JSON.stringify(return_data));
            res.end();
        } 
    });
};

exports.addNewAsset = function(req, res){
	var asset = new Asset(req.body);
	var message = null;
	// Then save the user
	asset.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			// Remove sensitive data before login

			Asset.find({}, function(err, assets){
				 res.json(assets);
			});
		}
	});	
};

exports.retrieveAssets = function(req, res){
	Asset.find({}, function(err, assets){
		 res.json(assets);
	});
};

exports.updateAsset = function(req, res){
	
	var nAsset = req.body.assetRecord;
	console.log(nAsset);
	Asset.findOneAndUpdate({'name': req.body.assetName}, {$set : nAsset}, function(err, asset){
		if(err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}else{
			res.json(asset);			
		}

	});
};

exports.deleteAsset = function(req, res){
	// User.find({'email': req.body.userEmail}).remove().exec();
	Asset.remove({'name': req.body.assetName}, function(err){
		if(err){
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}else{
			Asset.find({}, function(err, assets){
				res.json(assets);
			});
		}
	});
};

exports.retrieveCurrentAd = function(req, res){
	Asset.find({'display': true}, function(err, assets){
		var randPos = _.random(0, assets.length-1);
		res.json(assets[randPos]);

	});
};
